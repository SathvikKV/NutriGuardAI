import os
import vecs
import csv
import time
import io
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_embedding(text):
    try:
        response = client.embeddings.create(input=text, model="text-embedding-ada-002")
        return response.data[0].embedding
    except Exception as e:
        print(f"⚠️ Embedding error: {e}")
        return [0.0]*1536 

def run():
    print("🚀 Starting Simple Ingest v3 (Robust)...")
    url = os.getenv("DATABASE_URL")
    if not url:
        print("❌ No DB URL")
        return

    print(f"🔌 Connecting to {url.split('@')[1]}...")
    vx = vecs.create_client(url)
    docs = vx.get_or_create_collection(name="knowledge_base", dimension=1536)
    print("✅ Collection ready.")

    base_path = "/app/data"
    files = [
        # Note: headers in CSV might be slightly different than 'id', so we look for key substrings
        {"name": "ColorAdditives.csv", "type": "Color Additive", "id_search": "Color", "id_col": "Color", "cols": ["Color", "Status", "Use", "RESTRICTIONS"]},
        {"name": "FoodSubstances.csv", "type": "Food Substance", "id_search": "Substance", "id_col": "Substance", "cols": ["Substance", "Used for (Technical Effect)", "Other Names"]},
        {"name": "SCOGS.csv", "type": "GRAS Substance", "id_search": "GRAS Substance", "id_col": "GRAS Substance", "cols": ["GRAS Substance", "SCOGS Type of Conclusion", "Other Names"]}
    ]
    
    total_upserted = 0
    
    for meta in files:
        fname = meta["name"]
        fpath = os.path.join(base_path, fname)
        if not os.path.exists(fpath):
            print(f"⚠️ Missing: {fname}")
            continue
            
        print(f"📂 Processing {fname}...")
        
        try:
            with open(fpath, "r", encoding="utf-8-sig", errors="replace") as f:
                content = f.read()
                
            f_io = io.StringIO(content)
            
            # Find Header
            header_line_idx = -1
            lines = content.splitlines()
            
            for i, line in enumerate(lines):
                # Check for ID match
                if meta["id_search"] in line:
                    # Double check it looks like a CSV header (has commas)
                    if "," in line:
                        header_line_idx = i
                        print(f"   [DEBUG] Found header at line {i+1}: {line[:50]}...")
                        break
            
            if header_line_idx == -1:
                print(f"❌ Could not find header in {fname}")
                continue
                
            # Seek to header
            f_io.seek(0)
            for _ in range(header_line_idx):
                next(f_io)
                
            reader = csv.DictReader(f_io)
            # Verify fieldnames
            # print(f"   [DEBUG] Fieldnames: {reader.fieldnames}")
            
            batch = []
            
            row_count = 0
            for row in reader:
                row_count += 1
                name = row.get(meta["id_col"])
                
                # Handling empty rows or mismatched columns
                if not name or not name.strip(): continue
                
                # Compose Text
                text_parts = [f"Category: {meta['type']}"]
                for col in meta["cols"]:
                    val = row.get(col, "").strip()
                    if val: text_parts.append(f"{col}: {val}")
                text_content = "\n".join(text_parts)
                
                # ID
                safe_id = f"{meta['type']}-{name[:64]}".replace(" ", "-").lower()
                
                # Metadata
                metadata = {
                    "name": name,
                    "category": meta["type"],
                    "source": "FDA",
                    "file": fname
                }
                
                batch.append({"id": safe_id, "text": text_content, "metadata": metadata})

                if len(batch) >= 50:
                    try:
                        records = []
                        for item in batch:
                            emb = get_embedding(item['text'])
                            records.append((item['id'], emb, {"text": item['text'], **item['metadata']}))
                        
                        docs.upsert(records=records)
                        total_upserted += len(records)
                        print(f"   Upserted {len(records)} records (Total: {total_upserted})...")
                    except Exception as e:
                        print(f"❌ Error inserting batch: {e}")
                    batch = []
                    # time.sleep(0.5)

            # Final batch
            if batch:
                try:
                    records = []
                    for item in batch:
                        emb = get_embedding(item['text'])
                        records.append((item['id'], emb, {"text": item['text'], **item['metadata']}))
                    docs.upsert(records=records)
                    total_upserted += len(records)
                    print(f"   Upserted final {len(records)} records.")
                except Exception as e:
                    print(f"❌ Error inserting final batch: {e}")
                    
        except Exception as e:
             print(f"❌ File Processing Error: {e}")

    print(f"🏁 Full Ingest Done. Total Upserted: {total_upserted}")

if __name__ == "__main__":
    run()
