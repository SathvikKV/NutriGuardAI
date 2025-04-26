import os
import json
import random
from dotenv import load_dotenv
from datetime import datetime, timedelta, time
from sqlalchemy.orm import Session
from openai import OpenAI

from app.db.session import SessionLocal
from app.crud.meal_crud import create_meal

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

USER_ID = 3
DAYS = 7

MEAL_WINDOWS = {
    "Breakfast": (time(7, 0), time(10, 0)),
    "Lunch": (time(12, 0), time(14, 0)),
    "Dinner": (time(18, 0), time(20, 0)),
}

NOTE_OPTIONS = [
    "Post-workout meal", "Pre-workout snack", "Just a quick bite",
    "Meal with friends", "Relaxed meal at home", "High-carb focus", "Low-fat goal"
]

def random_time_between(start: time, end: time) -> time:
    start_min = start.hour * 60 + start.minute
    end_min = end.hour * 60 + end.minute
    random_min = random.randint(start_min, end_min)
    return time(random_min // 60, random_min % 60)

def call_llm_to_generate_meal(day_str: str, meal_type: str, meal_time_str: str, notes: str) -> dict:
    prompt = f"""
You are a fitness-aware meal assistant. Generate a {meal_type.lower()} meal log for a user on {day_str}.
It should contain varied items and macronutrients. Be realistic.

Return ONLY this JSON structure (no pretext):

{{
  "meal_name": "{meal_type} - {day_str}",
  "meal_type": "{meal_type}",
  "meal_time": "{meal_time_str}",
  "notes": "{notes}",
  "total_calories": number,
  "total_protein": number,
  "total_carbs": number,
  "total_fat": number,
  "items": [
    {{
      "food_name": "string",
      "quantity": "string",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number
    }}
  ]
}}
"""

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    content = response.choices[0].message.content.strip()
    print("📝 Raw LLM JSON:\n", content)
    return json.loads(content)

def generate_meal_logs():
    print("🚀 Starting synthetic meal generation script...")
    db: Session = SessionLocal()
    today = datetime.now()

    for i in range(DAYS):
        day = today - timedelta(days=i)
        day_str = day.strftime("%Y-%m-%d")

        for meal_type in ["Breakfast", "Lunch", "Dinner"]:
            meal_start, meal_end = MEAL_WINDOWS[meal_type]
            rand_time = random_time_between(meal_start, meal_end)
            meal_datetime = datetime.combine(day.date(), rand_time)
            meal_time_str = meal_datetime.strftime("%Y-%m-%dT%H:%M:%S")
            notes = random.choice(NOTE_OPTIONS)

            print(f"Calling LLM for {meal_type} on {day_str}...")
            try:
                meal_data = call_llm_to_generate_meal(day_str, meal_type, meal_time_str, notes)
                meal_data["meal_time"] = datetime.strptime(meal_data["meal_time"], "%Y-%m-%dT%H:%M:%S")

                create_meal(
                    db=db,
                    user_id=USER_ID,
                    meal_name=meal_data["meal_name"],
                    meal_type=meal_data["meal_type"],
                    meal_time=meal_data["meal_time"],
                    notes=meal_data["notes"],
                    total_calories=meal_data["total_calories"],
                    total_protein=meal_data["total_protein"],
                    total_carbs=meal_data["total_carbs"],
                    total_fat=meal_data["total_fat"],
                    items=meal_data["items"]
                )
                print(f"Logged {meal_type} on {day_str}")
            except Exception as e:
                print(f"Error on {day_str} {meal_type}: {e}")
                db.rollback()

    db.close()
    print(f"Finished logging meals for {DAYS} days.")

if __name__ == "__main__":
    generate_meal_logs()
