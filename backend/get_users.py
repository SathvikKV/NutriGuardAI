import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

DB_URL = os.getenv("DATABASE_URL")
if not DB_URL:
    print("❌ No DATABASE_URL found")
    exit(1)

try:
    engine = create_engine(DB_URL)
    with engine.connect() as conn:
        result = conn.execute(text("SELECT id, email FROM users LIMIT 5;"))
        print("\n--- USERS ---")
        for row in result:
             print(f"ID: {row[0]} | Email: {row[1]}")
        print("-------------\n")

except Exception as e:
    print(f"❌ Error: {e}")
