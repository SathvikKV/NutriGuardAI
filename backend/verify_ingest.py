import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def verify_data():
    url = os.getenv("DATABASE_URL")
    print(f"Connecting to: {url.split('@')[1] if '@' in url else '...'}")
    
    try:
        conn = psycopg2.connect(url)
        cur = conn.cursor()
        
        # Check tables in 'vecs' schema
        cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'vecs';")
        tables = cur.fetchall()
        print(f"Tables in 'vecs' schema: {tables}")
        
        target_table = None
        for t in tables:
            if "knowledge_base" in t[0]:
                target_table = f'vecs."{t[0]}"'
                break
        
        if target_table:
            print(f"Checking count in {target_table}...")
            cur.execute(f"SELECT count(*) FROM {target_table};")
            count = cur.fetchone()[0]
            print(f"📊 Row Count: {count}")
            
            if count > 0:
                print("📝 Sample Rows:")
                cur.execute(f"SELECT id, metadata FROM {target_table} LIMIT 3;")
                for row in cur.fetchall():
                    print(row)
        else:
            print("❌ knowledge_base table not found in vecs schema.")
            
        conn.close()
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    verify_data()
