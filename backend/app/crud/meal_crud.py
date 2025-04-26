from sqlalchemy.orm import Session
from app.models.meal import Meal, MealItem
from datetime import datetime
from typing import List
from sqlalchemy.orm import joinedload

# Create a meal and its items
def create_meal(
    db: Session,
    user_id: int,
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
        notes=notes,
        total_calories=total_calories,
        total_protein=total_protein,
        total_carbs=total_carbs,
        total_fat=total_fat,
    )
    db.add(meal)
    db.flush()  # Get the generated meal.id before committing

    for item in items:
        meal_item = MealItem(
            meal_id=meal.id,
            food_name=item["food_name"],
            quantity=item["quantity"],
            calories=item["calories"],
            protein=item["protein"],
            carbs=item["carbs"],
            fat=item["fat"],
        )
        db.add(meal_item)

    db.commit()
    db.refresh(meal)
    return meal


# Get all meals for a user
def get_meals_by_user(db: Session, user_id: int):
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
