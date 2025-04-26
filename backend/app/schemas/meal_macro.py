from pydantic import BaseModel
from typing import Optional, List

class MacroEstimationRequest(BaseModel):
    meal_name: str
    meal_type: str
    meal_time: str
    quantity: Optional[str] = "1 serving"
    notes: Optional[str] = None

class MealItemEstimate(BaseModel):
    food_name: str
    quantity: str
    calories: int
    protein: int
    carbs: int
    fat: int

class MacroEstimationResponse(BaseModel):
    total_calories: int
    total_protein: int
    total_carbs: int
    total_fat: int
    items: List[MealItemEstimate]
