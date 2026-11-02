
from sqlalchemy import (
    Column, Integer, String, Text,
    Float, Boolean, ForeignKey, DateTime
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from pgvector.sqlalchemy import Vector

from .database import Base


class HeritageItem(Base):
    __tablename__ = "heritage_items"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(255), nullable=False)
    description = Column(Text)

    city = Column(String(100))
    state = Column(String(100))

    latitude = Column(Float)
    longitude = Column(Float)

    date = Column(String(100))
    source = Column(Text)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    media = relationship(
        "Media",
        back_populates="heritage_item",
        cascade="all, delete-orphan"
    )

    tags = relationship(
        "Tag",
        back_populates="heritage_item",
        cascade="all, delete-orphan"
    )


class Media(Base):
    __tablename__ = "media"

    id = Column(Integer, primary_key=True, index=True)

    heritage_id = Column(
        Integer,
        ForeignKey("heritage_items.id"),
        nullable=False
    )

    image_url = Column(String(500), nullable=False)
    thumbnail_url = Column(String(500))

    uploader = Column(String(150))
    caption = Column(Text)
    licence = Column(String(150))

    review_status = Column(
        String(30),
        default="pending"
    )

    # CLIP produces 512-dimensional embeddings.
    embedding = Column(Vector(512))

    heritage_item = relationship(
        "HeritageItem",
        back_populates="media"
    )


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)

    heritage_id = Column(
        Integer,
        ForeignKey("heritage_items.id"),
        nullable=False
    )

    name = Column(String(150), nullable=False)

    # Examples: state, purpose, type, period
    category = Column(String(100), nullable=False)

    confidence = Column(Float)

    verified = Column(Boolean, default=False)

    heritage_item = relationship(
        "HeritageItem",
        back_populates="tags"
    )
