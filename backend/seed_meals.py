from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.db.session import SessionLocal
from app.models.meal import Meal, MealItem
import datetime

USER_ID = "544bde3a-92aa-4008-ba3f-19b39e4b5be5"

def seed():
    db = SessionLocal()
    try:
        # Check if meals exist
        existing = db.execute(text(f"SELECT count(*) FROM meals WHERE user_id = '{USER_ID}'")).scalar()
        if existing > 0:
            print(f"⚠️ User {USER_ID} already has {existing} meals. Skipping seed.")
            return

        print(f"🌱 Seeding meals for {USER_ID}...")

        # Breakfast
        m1 = Meal(
            user_id=USER_ID,
            meal_name="Oatmeal with Berries",
            meal_type="Breakfast",
            meal_time=datetime.datetime.now() - datetime.timedelta(hours=4),
            total_calories=350,
            total_protein=12,
            total_carbs=60,
            total_fat=6,
            notes="Healthy start"
        )
        db.add(m1)
        db.commit() # Commit to get ID
        
        i1 = MealItem(meal_id=m1.id, food_name="Oats", quantity="1 cup", calories=150, protein=5, carbs=27, fat=3)
        i2 = MealItem(meal_id=m1.id, food_name="Blueberries", quantity="0.5 cup", calories=40, protein=1, carbs=10, fat=0)
        db.add_all([i1, i2])

        # Lunch
        m2 = Meal(
            user_id=USER_ID,
            meal_name="Grilled Chicken Salad",
            meal_type="Lunch",
            meal_time=datetime.datetime.now(),
            total_calories=450,
            total_protein=40,
            total_carbs=12,
            total_fat=20,
            notes="Low carb"
        )
        db.add(m2)
        db.commit()

        i3 = MealItem(meal_id=m2.id, food_name="Chicken Breast", quantity="200g", calories=330, protein=60, carbs=0, fat=7)
        i4 = MealItem(meal_id=m2.id, food_name="Mixed Greens", quantity="2 cups", calories=20, protein=2, carbs=4, fat=0)
        db.add_all([i3, i4])

        db.commit()
        print("✅ Seeding complete!")

    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
