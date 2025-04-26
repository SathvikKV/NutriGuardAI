# app/core/meal_rag_ingest.py

from sqlalchemy.orm import Session
from app.models.meal import Meal, MealItem
from app.core.chunk_meals import format_meal_as_text
from app.core.pinecone_utils import upsert_embeddings
from openai import OpenAI
from dotenv import load_dotenv
import os
import uuid

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
EMBEDDING_MODEL = "text-embedding-ada-002"

def get_meal_embedding(text: str):
    response = client.embeddings.create(input=text, model=EMBEDDING_MODEL)
    return response.data[0].embedding

def ingest_user_meals(db: Session, user_id: int):
    meals = db.query(Meal).filter(Meal.user_id == user_id).all()
    vectors = []

    for meal in meals:
        items = db.query(MealItem).filter(MealItem.meal_id == meal.id).all()
        text = format_meal_as_text(meal, items)
        embedding = get_meal_embedding(text)

        vector = (
            f"meal-{meal.id}-{str(uuid.uuid4())[:8]}",
            embedding,
            {"text": text, "user_id": str(user_id)}
        )
        vectors.append(vector)

    upsert_embeddings(vectors, index_name=os.getenv("PINECONE_MEAL_INDEX"))
    return {"status": "success", "count": len(vectors)}
