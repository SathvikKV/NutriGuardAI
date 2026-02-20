# scripts/init_db.py
import sys
import os

# Add backend directory to path so we can import 'app'
backend_dir = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.append(backend_dir)

from sqlalchemy import create_engine, text
from app.db.base_class import Base
from app.models.user import User
from app.models.meal import Meal, MealItem
from app.core.config import settings
from dotenv import load_dotenv

load_dotenv(os.path.join(backend_dir, '.env'))

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("❌ Error: DATABASE_URL not found in .env")
    sys.exit(1)

def init_db():
    print(f"🔌 Connecting to database...")
    engine = create_engine(DATABASE_URL)

    with engine.connect() as connection:
        # 1. Enable vector extension (required for RAG)
        print("🔧 Enabling extensions...")
        connection.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
        connection.execute(text("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"))
        connection.commit()
    
    print("🏗️ Creating tables...")
    # This will create tables for all models imported (User, Meal, MealItem)
    Base.metadata.create_all(bind=engine)
    
    print("✅ Database initialized successfully!")
    print("   - Enabled extensions: vector, uuid-ossp")
    print("   - Created tables: users, meals, meal_items")

if __name__ == "__main__":
    init_db()
