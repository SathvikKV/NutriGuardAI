from sqlalchemy.orm import Session
from app.models.meal import Meal, MealItem
from datetime import datetime
from typing import List
from sqlalchemy.orm import joinedload

# Create a meal and its items
def create_meal(
    db: Session,
    user_id: str,
    meal_name: str,
    meal_type: str,
    meal_time: datetime,
    notes: str,
    total_calories: float,
    total_protein: float,
    total_carbs: float,
    total_fat: float,
    items: List[dict]
):
    meal = Meal(
        user_id=user_id,
        meal_name=meal_name,
        meal_type=meal_type,
        meal_time=meal_time,
        # ...
    )
    # ...

# Get all meals for a user
def get_meals_by_user(db: Session, user_id: str):
    return db.query(Meal).filter(Meal.user_id == user_id).all()


# Get a specific meal with items
def get_meal_with_items(db: Session, meal_id: int):
    return db.query(Meal).filter(Meal.id == meal_id).first()


# Delete a meal
def delete_meal(db: Session, meal_id: int):
    meal = db.query(Meal).filter(Meal.id == meal_id).first()
    if meal:
        db.delete(meal)
        db.commit()
        return True
    return False
