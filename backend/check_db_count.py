import os
import vecs
from dotenv import load_dotenv

load_dotenv()

def check_db_count():
    try:
        vx = vecs.create_client(os.getenv("DATABASE_URL"))
        docs = vx.get_collection(name="knowledge_base")
        # vecs doesn't have a direct count, but we can try to fetch a few
        # or use psycopg2 for a direct count if needed.
        # Let's peek at the first item
        print("✅ Connected to Supabase via vecs.")
        
        # internal check - assuming vecs 0.4+ adapter logic
        # accessing the underlying table directly via SQL is better for count
        import psycopg2
        conn = psycopg2.connect(os.getenv("DATABASE_URL"))
        cur = conn.cursor()
        cur.execute("SELECT count(*) FROM vec.knowledge_base;") # vecs usually uses schema 'vec' and table name
        count = cur.fetchone()[0]
        print(f"📊 Total Rows in 'knowledge_base': {count}")
        
        cur.execute("SELECT id, metadata FROM vec.knowledge_base LIMIT 3;")
        rows = cur.fetchall()
        print("📝 Sample Data:")
        for r in rows:
            print(r)
            
        conn.close()
            
    except Exception as e:
        print(f"❌ Error: {e}")
        # Fallback to verify if collection exists at all using vecs
        try:
             vx = vecs.create_client(os.getenv("DATABASE_URL"))
             cols = vx.list_collections()
             print(f"📚 Available Collections: {cols}")
        except Exception as e2:
             print(f"❌ Critical Connection Error: {e2}")

if __name__ == "__main__":
    check_db_count()
