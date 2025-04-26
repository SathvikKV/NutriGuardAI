# app/api/v1/meal_summary_routes.py

from fastapi import APIRouter, HTTPException, Path, Depends
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.meal import Meal
from datetime import datetime, timedelta
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter(tags=["Meal Summary"])
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

LLM_MODEL = "gpt-3.5-turbo"

# Dependency

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/meals/summary/{user_id}")
def get_meal_summary(
    user_id: int = Path(..., description="ID of the user to summarize meals for"),
    db: Session = Depends(get_db)
):
    today = datetime.now()
    last_week = today - timedelta(days=7)

    meals = db.query(Meal).filter(Meal.user_id == user_id, Meal.meal_time >= last_week).all()

    if not meals:
        raise HTTPException(status_code=404, detail="No meals found for the past week.")

    # Prepare a natural language dump of meal data
    meal_descriptions = []
    for meal in meals:
        meal_descriptions.append(
            f"{meal.meal_time.strftime('%A')} - {meal.meal_type}: {meal.meal_name}, Calories: {meal.total_calories}, Protein: {meal.total_protein}g, Carbs: {meal.total_carbs}g, Fat: {meal.total_fat}g"
        )

    summary_prompt = f"""
You're a friendly and knowledgeable nutrition assistant. A user has logged their meals for the past 7 days. Your job is to review the meal pattern, identify trends in macronutrient intake, and gently offer suggestions for improvement.

Be encouraging, highlight both strengths and areas for growth, and explain *why* certain adjustments would help (e.g., energy, digestion, recovery). Write like you're talking to someone who genuinely wants to eat better but doesn't want to be judged.

Here is the meal log:
{chr(10).join(meal_descriptions)}

Respond in a friendly tone, in 2–3 short paragraphs. Be specific, encouraging, and helpful.
"""


    try:
        response = client.chat.completions.create(
            model=LLM_MODEL,
            messages=[{"role": "user", "content": summary_prompt}],
            temperature=0.7,
        )
        return {
            "user_id": user_id,
            "summary": response.choices[0].message.content.strip(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
