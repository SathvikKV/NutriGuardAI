from fastapi import APIRouter, HTTPException
from app.schemas.meal_macro import MacroEstimationRequest, MacroEstimationResponse, MealItemEstimate
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
router = APIRouter(tags=["Meal Macro Estimation"])

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
LLM_MODEL = "gpt-3.5-turbo"

@router.post("/meals/generate-macros", response_model=MacroEstimationResponse)
async def generate_macros(payload: MacroEstimationRequest):
    try:
        system_prompt = """
You are a certified nutritionist AI. Based on the provided meal name, type, quantity, and notes, estimate the total calories and macronutrient breakdown (protein, carbs, fat). Also suggest a breakdown of food items that make up this meal.

Respond in JSON with the following structure:
{
  "total_calories": int,
  "total_protein": int,
  "total_carbs": int,
  "total_fat": int,
  "items": [
    {
      "food_name": str,
      "quantity": str,
      "calories": int,
      "protein": int,
      "carbs": int,
      "fat": int
    },
    ...
  ]
}
"""

        user_input = f"""
Meal: {payload.meal_name}
Type: {payload.meal_type}
Quantity: {payload.quantity}
Notes: {payload.notes or 'None'}
"""

        response = client.chat.completions.create(
            model=LLM_MODEL,
            messages=[
                {"role": "system", "content": system_prompt.strip()},
                {"role": "user", "content": user_input.strip()}
            ],
            temperature=0.3,
        )

        parsed_json = response.choices[0].message.content.strip()
        parsed_data = eval(parsed_json)  # Optionally replace this with `json.loads(...)` for safety

        return parsed_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
