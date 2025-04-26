from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from app.core.analysis_engine import analyze_ingredients

router = APIRouter(tags=["Ingredient Analysis"])

class IngredientList(BaseModel):
    ingredients: List[str]

@router.post("/analyze")
async def analyze(ingredients: IngredientList):
    try:
        result = analyze_ingredients(ingredients.ingredients)
        return result
    except Exception as e:
        return {"error": str(e)}
