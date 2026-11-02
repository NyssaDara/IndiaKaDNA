
import io
import torch

from PIL import Image
from transformers import CLIPModel, CLIPProcessor


MODEL_NAME = "openai/clip-vit-base-patch32"

model = None
processor = None


def load_model():
    global model, processor

    if model is None:
        processor = CLIPProcessor.from_pretrained(MODEL_NAME)
        model = CLIPModel.from_pretrained(MODEL_NAME)
        model.eval()

    return model, processor


# Categories that AI will evaluate.

CATEGORY_LABELS = {
    "type": [
        "monument",
        "historical fort",
        "palace",
        "temple",
        "mosque",
        "church",
        "archaeological site",
        "garden or park",
        "museum",
        "historical building",
        "stepwell",
        "heritage bridge"
    ],

    "purpose": [
        "memorial",
        "religious site",
        "defensive structure",
        "royal residence",
        "administrative building",
        "public gathering place",
        "educational institution",
        "recreational place"
    ]
}


def analyse_image(image_bytes):

    model, processor = load_model()

    image = Image.open(
        io.BytesIO(image_bytes)
    ).convert("RGB")

    all_tags = []

    with torch.no_grad():

        # Generate image embeddings.
        image_inputs = processor(
            images=image,
            return_tensors="pt"
        )

        image_features = model.get_image_features(
            **image_inputs
        )

        image_features = image_features / image_features.norm(
            dim=-1, keepdim=True
        )

        embedding = image_features[0].tolist()

        # Classify the image against candidate labels.
        for category, labels in CATEGORY_LABELS.items():

            prompts = [
                f"A photograph of {label} in India"
                for label in labels
            ]

            text_inputs = processor(
                text=prompts,
                return_tensors="pt",
                padding=True
            )

            text_features = model.get_text_features(
                **text_inputs
            )

            text_features = text_features / text_features.norm(
                dim=-1, keepdim=True
            )

            scores = (
                image_features @ text_features.T
            )[0]

            probabilities = torch.softmax(scores * 100, dim=0)

            # Keep the two strongest suggestions per category.
            top_results = torch.topk(
                probabilities,
                k=min(2, len(labels))
            )

            for index, score in zip(
                top_results.indices.tolist(),
                top_results.values.tolist()
            ):

                all_tags.append({
                    "name": labels[index],
                    "category": category,
                    "confidence": float(score)
                })

    return {
        "tags": all_tags,
        "embedding": embedding
    }


def create_text_embedding(text):

    model, processor = load_model()

    inputs = processor(
        text=[text],
        return_tensors="pt",
        padding=True
    )

    with torch.no_grad():

        features = model.get_text_features(**inputs)

        features = features / features.norm(
            dim=-1,
            keepdim=True
        )

    return features[0].tolist()
