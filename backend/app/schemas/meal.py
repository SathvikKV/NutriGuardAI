from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# MealItem Schema
class MealItemBase(BaseModel):
    food_name: str
    quantity: Optional[str] = None
    calories: Optional[float] = None
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fat: Optional[float] = None


class MealItemCreate(MealItemBase):
    pass


class MealItemResponse(MealItemBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


# Meal Schema
class MealBase(BaseModel):
    meal_name: str
    meal_type: Optional[str] = None
    meal_time: datetime
    notes: Optional[str] = None
    total_calories: Optional[float] = None
    total_protein: Optional[float] = None
    total_carbs: Optional[float] = None
    total_fat: Optional[float] = None


class MealCreate(MealBase):
    user_id: int
    items: List[MealItemCreate]  # Nested creation


class MealResponse(MealBase):
    id: int
    created_at: datetime
    items: List[MealItemResponse] = []

    class Config:
        orm_mode = True
