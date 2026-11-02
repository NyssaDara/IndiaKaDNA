
import os
import uuid
from io import BytesIO
from pathlib import Path
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from PIL import Image

from fastapi import (
    FastAPI, UploadFile, File, Form,
    Depends, HTTPException, Query
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from sqlalchemy.orm import Session

from .database import get_db, init_db
from .models import HeritageItem, Media, Tag
from .ai_service import analyse_image, create_text_embedding


load_dotenv()

AI_ENABLED = os.getenv("ENABLE_AI", "false").lower() == "true"

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
ORIGINAL_DIR = UPLOAD_DIR / "originals"
THUMB_DIR = UPLOAD_DIR / "thumbnails"

ORIGINAL_DIR.mkdir(parents=True, exist_ok=True)
THUMB_DIR.mkdir(parents=True, exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="IndiaKaDNA API",
    description="AI-powered Indian Cultural Heritage Archive",
    version="1.0.0",
    lifespan=lifespan
)


# Allow React frontend to communicate with FastAPI.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Serve uploaded images.
app.mount(
    "/uploads",
    StaticFiles(directory=str(UPLOAD_DIR)),
    name="uploads"
)


@app.get("/")
def home():
    return {
        "message": "Welcome to IndiaKaDNA API",
        "status": "running"
    }


@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "ai_enabled": AI_ENABLED
    }


# -------------------------------
# ADMIN: UPLOAD HERITAGE IMAGE
# -------------------------------

@app.post("/api/admin/upload")
async def upload_heritage(
    file: UploadFile = File(...),

    title: str = Form(...),
    description: str = Form(""),

    city: str = Form(""),
    state: str = Form(""),

    date: str = Form(""),
    source: str = Form(""),

    caption: str = Form(""),
    uploader: str = Form("admin"),
    licence: str = Form(""),

    latitude: float | None = Form(None),
    longitude: float | None = Form(None),

    db: Session = Depends(get_db)
):

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload an image."
        )

    content = await file.read()

    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Image size must be below 10 MB."
        )

    try:
        image = Image.open(BytesIO(content))
        image.verify()

        image = Image.open(BytesIO(content)).convert("RGB")

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid or unsupported image."
        )

    if image.width < 100 or image.height < 100:
        raise HTTPException(
            status_code=400,
            detail="Image resolution is too small."
        )

    image_id = str(uuid.uuid4())

    original_path = ORIGINAL_DIR / f"{image_id}.jpg"
    thumbnail_path = THUMB_DIR / f"{image_id}.jpg"

    # Save original image separately.
    image.save(original_path, format="JPEG", quality=95)

    # Generate thumbnail.
    thumbnail = image.copy()
    thumbnail.thumbnail((500, 500))
    thumbnail.save(thumbnail_path, format="JPEG", quality=85)

    image_url = f"/uploads/originals/{image_id}.jpg"
    thumbnail_url = f"/uploads/thumbnails/{image_id}.jpg"

    # Create heritage record.
    item = HeritageItem(
        title=title,
        description=description,
        city=city,
        state=state,
        date=date,
        source=source,
        latitude=latitude,
        longitude=longitude
    )

    db.add(item)
    db.flush()

    ai_tags = []
    embedding = None
    ai_error = None

    # Run AI classification.
    if AI_ENABLED:

        try:
            ai_result = analyse_image(content)

            ai_tags = ai_result["tags"]
            embedding = ai_result["embedding"]

        except Exception as error:
            ai_error = str(error)

    # Save media information.
    media = Media(
        heritage_id=item.id,
        image_url=image_url,
        thumbnail_url=thumbnail_url,
        uploader=uploader,
        caption=caption,
        licence=licence,
        review_status="pending",
        embedding=embedding
    )

    db.add(media)

    # Save AI-generated tags.
    for tag_data in ai_tags:

        tag = Tag(
            heritage_id=item.id,
            name=tag_data["name"],
            category=tag_data["category"],
            confidence=tag_data["confidence"],
            verified=False
        )

        db.add(tag)

    db.commit()
    db.refresh(item)

    return {
        "message": "Heritage image uploaded successfully",
        "heritage_id": item.id,
        "image_url": image_url,
        "thumbnail_url": thumbnail_url,
        "ai_tags": ai_tags,
        "ai_status": (
            "completed" if ai_tags else
            "failed" if ai_error else
            "disabled"
        ),
        "ai_error": ai_error
    }


# -------------------------------
# USER: GET ALL HERITAGE RECORDS
# -------------------------------

@app.get("/api/heritage")
def get_heritage(
    state: str | None = None,
    city: str | None = None,
    category: str | None = None,
    db: Session = Depends(get_db)
):

    query = db.query(HeritageItem)

    if state:
        query = query.filter(
            HeritageItem.state.ilike(state)
        )

    if city:
        query = query.filter(
            HeritageItem.city.ilike(city)
        )

    if category:
        query = query.join(HeritageItem.tags).filter(
            Tag.name.ilike(category)
        )

    items = query.distinct().all()

    results = []

    for item in items:

        results.append({
            "id": item.id,
            "title": item.title,
            "description": item.description,
            "city": item.city,
            "state": item.state,

            "images": [
                {
                    "url": media.image_url,
                    "thumbnail": media.thumbnail_url
                }
                for media in item.media
            ],

            "tags": [
                {
                    "name": tag.name,
                    "category": tag.category,
                    "verified": tag.verified
                }
                for tag in item.tags
            ]
        })

    return results


# -------------------------------
# USER: GET INDIVIDUAL RECORD
# -------------------------------

@app.get("/api/heritage/{heritage_id}")
def get_heritage_details(
    heritage_id: int,
    db: Session = Depends(get_db)
):

    item = db.query(HeritageItem).filter(
        HeritageItem.id == heritage_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Heritage record not found."
        )

    return {
        "id": item.id,
        "title": item.title,
        "description": item.description,
        "city": item.city,
        "state": item.state,
        "latitude": item.latitude,
        "longitude": item.longitude,
        "date": item.date,
        "source": item.source,

        "images": [
            {
                "url": media.image_url,
                "thumbnail": media.thumbnail_url,
                "caption": media.caption,
                "review_status": media.review_status
            }
            for media in item.media
        ],

        "tags": [
            {
                "name": tag.name,
                "category": tag.category,
                "confidence": tag.confidence,
                "verified": tag.verified
            }
            for tag in item.tags
        ]
    }


# -------------------------------
# USER: SEARCH HERITAGE
# -------------------------------

@app.get("/api/search")
def search_heritage(
    q: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):

    if AI_ENABLED:

        try:
            query_embedding = create_text_embedding(q)

            distance = Media.embedding.cosine_distance(
                query_embedding
            )

            results = (
                db.query(HeritageItem, distance.label("distance"))
                .join(Media)
                .filter(Media.embedding.is_not(None))
                .order_by(distance)
                .limit(limit)
                .all()
            )

            return [
                {
                    "id": item.id,
                    "title": item.title,
                    "city": item.city,
                    "state": item.state,
                    "distance": float(score),
                }
                for item, score in results
            ]

        except Exception:
            pass

    # Fallback: keyword search.
    search_term = f"%{q}%"

    results = db.query(HeritageItem).filter(
        (HeritageItem.title.ilike(search_term)) |
        (HeritageItem.description.ilike(search_term)) |
        (HeritageItem.city.ilike(search_term)) |
        (HeritageItem.state.ilike(search_term))
    ).limit(limit).all()

    return [
        {
            "id": item.id,
            "title": item.title,
            "city": item.city,
            "state": item.state
        }
        for item in results
    ]


# -------------------------------
# ADMIN: VERIFY AI TAGS
# -------------------------------

@app.post("/api/admin/heritage/{heritage_id}/verify")
def verify_heritage(
    heritage_id: int,
    db: Session = Depends(get_db)
):

    item = db.query(HeritageItem).filter(
        HeritageItem.id == heritage_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Heritage record not found."
        )

    for tag in item.tags:
        tag.verified = True

    for media in item.media:
        media.review_status = "verified"

    db.commit()

    return {
        "message": "Heritage record verified successfully",
        "heritage_id": heritage_id
    }
