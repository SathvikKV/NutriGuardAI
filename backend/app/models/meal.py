# app/models/meal.py

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base  # Correct Base import

# -------------------
# MEAL TABLE (Parent)
# -------------------
class Meal(Base):
    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Link to User table
    meal_name = Column(String, nullable=False)
    meal_type = Column(String)  # Eg: breakfast/lunch/dinner/snack
    meal_time = Column(DateTime, nullable=False)
    notes = Column(String)

    total_calories = Column(Float)
    total_protein = Column(Float)
    total_carbs = Column(Float)
    total_fat = Column(Float)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    items = relationship("MealItem", backref="meal", cascade="all, delete-orphan")

# -------------------
# MEAL ITEMS TABLE (Child)
# -------------------
class MealItem(Base):
    __tablename__ = "meal_items"

    id = Column(Integer, primary_key=True, index=True)
    meal_id = Column(Integer, ForeignKey("meals.id"), nullable=False)
    food_name = Column(String, nullable=False)
    quantity = Column(String)
    calories = Column(Float)
    protein = Column(Float)
    carbs = Column(Float)
    fat = Column(Float)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
