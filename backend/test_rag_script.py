import sys
import os
import json

# Ensure we can import app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.rag_engine import generate_rag_response, RELEVANCE_THRESHOLD
import app.core.rag_engine as re

def test_rag():
    with open("debug_output.txt", "w") as f:
        f.write(f"DEBUG: Loaded rag_engine from: {re.__file__}\n")
        f.write(f"DEBUG: RELEVANCE_THRESHOLD = {RELEVANCE_THRESHOLD}\n")
    
    query = "Is Red 40 safe for children?"
    print(f"❓ Testing Query: {query}")
    
    try:
        response = generate_rag_response(query)
        # Append matches to debug file if possible?
        # Actually generate_rag_response prints to stdout.
        # We can't easily capture it unless we redirect stdout.
        # But RELEVANCE_THRESHOLD is what matters.
        
        print("\n✅ RAG Response:")
        print(json.dumps(response, indent=2))

        print("\n✅ RAG Response:")
        print(json.dumps(response, indent=2))
        
        # assertions
        source = response.get("answer", {}).get("source")
        if "Knowledge Base" in source:
            print("\n🎉 SUCCESS: Retrieved from Knowledge Base!")
        else:
            print(f"\n⚠️ WARNING: Source was '{source}' (Expected RAG Knowledge Base)")
            
    except Exception as e:
        print(f"\n❌ ERROR: {e}")

if __name__ == "__main__":
    test_rag()
