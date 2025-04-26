# app/api/v1/meal_routes.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.meal import MealCreate, MealResponse
from app.crud import meal_crud
from typing import List

router = APIRouter(prefix="/meals", tags=["Meals"])

# POST /meals/ → log a meal
@router.post("/", response_model=MealResponse)
def log_meal(meal: MealCreate, db: Session = Depends(get_db)):
    return meal_crud.create_meal(
        db=db,
        user_id=meal.user_id,
        meal_name=meal.meal_name,
        meal_type=meal.meal_type,
        meal_time=meal.meal_time,
        notes=meal.notes,
        total_calories=meal.total_calories,
        total_protein=meal.total_protein,
        total_carbs=meal.total_carbs,
        total_fat=meal.total_fat,
        items=[item.dict() for item in meal.items]
    )

# GET /meals/{user_id} → get meals by user
@router.get("/user/{user_id}", response_model=List[MealResponse])
def get_meals_by_user(user_id: int, db: Session = Depends(get_db)):
    return meal_crud.get_meals_by_user(db, user_id)

# GET /meals/{meal_id} → get one meal with items
@router.get("/{meal_id}", response_model=MealResponse)
def get_meal(meal_id: int, db: Session = Depends(get_db)):
    meal = meal_crud.get_meal_with_items(db, meal_id)
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    return meal

# DELETE /meals/{meal_id}
@router.delete("/{meal_id}", status_code=204)
def delete_meal(meal_id: int, db: Session = Depends(get_db)):
    success = meal_crud.delete_meal(db, meal_id)
    if not success:
        raise HTTPException(status_code=404, detail="Meal not found")
