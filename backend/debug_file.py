import os

path = "/app/data/FoodSubstances.csv"

if not os.path.exists(path):
    print("❌ File missing")
else:
    print(f"📂 File exists. Size: {os.path.getsize(path)}")
    try:
        print("--- READING UTF-8 ---")
        with open(path, "r", encoding="utf-8") as f:
            for i in range(5): print(repr(f.readline()))
    except Exception as e:
        print(f"❌ UTF-8 Error: {e}")

    try:
        print("--- READING LATIN-1 ---")
        with open(path, "r", encoding="latin-1") as f:
            for i in range(5): print(repr(f.readline()))
    except Exception as e:
        print(f"❌ LATIN-1 Error: {e}")
