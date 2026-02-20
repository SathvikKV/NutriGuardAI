import sys
import os
import json

# Add backend to sys path
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.core.rag_engine import generate_rag_response

def test_rag():
    query = "Is Red 40 safe for children?"
    print(f"❓ Testing Query: {query}")
    
    try:
        response = generate_rag_response(query)
        print("\n✅ RAG Response:")
        print(json.dumps(response, indent=2))
        
        # assertions
        source = response.get("answer", {}).get("source")
        if "RAG Knowledge Base" in source:
            print("\n🎉 SUCCESS: Retrieved from Knowledge Base!")
        else:
            print(f"\n⚠️ WARNING: Source was '{source}' (Expected RAG Knowledge Base)")
            
    except Exception as e:
        print(f"\n❌ ERROR: {e}")

if __name__ == "__main__":
    test_rag()
