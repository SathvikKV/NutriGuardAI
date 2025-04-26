# app/schemas/ocr.py

from pydantic import BaseModel
from typing import List, Dict, Optional

class IngredientAnalysis(BaseModel):
    ingredient: str
    purpose: Optional[str]
    category: Optional[str]
    risk_level: Optional[str]

class NutritionSummaryRequest(BaseModel):
    product_name: str
    ingredients: List[str]
    analysis: List[IngredientAnalysis]
