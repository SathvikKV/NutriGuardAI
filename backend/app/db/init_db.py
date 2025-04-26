# app/db/init_db.py

from sqlalchemy import create_engine
import os
from dotenv import load_dotenv
from app.db.base_class import Base
from app import models  # 👈 This will import all models to register them with Base

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

def create_tables():
    Base.metadata.create_all(bind=engine)

create_tables()
