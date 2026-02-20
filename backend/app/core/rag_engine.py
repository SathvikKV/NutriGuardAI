import os
import json
from dotenv import load_dotenv
from openai import OpenAI
import vecs
# from app.core.pinecone_utils import search_embeddings # Deprecated
from app.core.web_search import search_web

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

EMBEDDING_MODEL = "text-embedding-ada-002"
LLM_MODEL = "gpt-3.5-turbo"
RELEVANCE_THRESHOLD = 0.65

def get_query_embedding(query: str) -> list:
    response = client.embeddings.create(
        input=query,
        model=EMBEDDING_MODEL
    )
    return response.data[0].embedding

def query_knowledge_base(query_embedding):
    """
    Query Supabase via vecs
    """
    vx = vecs.create_client(os.getenv("DATABASE_URL"))
    docs = vx.get_collection(name="knowledge_base")
    # Returns: ["id1", "id2"], [score1, score2], [metadata_dict1...]
    results = docs.query(
        data=query_embedding,
        limit=3,
        include_value=True,
        include_metadata=True
    )
    return results

def generate_rag_response(user_query: str) -> dict:
    print(f"🔎 RAG Query: {user_query}")
    query_embedding = get_query_embedding(user_query)
    
    # Query Knowledge Base
    # Query Knowledge Base
    # try:
    results = query_knowledge_base(query_embedding)
    matches = []
    
    print(f"   [DEBUG] Raw Results: {len(results)} items")
    
    for item in results:
        # Unpack explicitly to debug structure
        # vecs 0.4: might be dict or tuple?
        # Assuming tuple based on docs: (id, score, metadata)
        try:
            id, score, metadata = item
            score = float(score)
            print(f"   [DEBUG] Found: {metadata.get('name')} (Score: {score})") 
            
            if score >= RELEVANCE_THRESHOLD:
                print("   [DEBUG] --> MATCHED!")
                matches.append({"text": metadata.get("text", ""), "score": score, "metadata": metadata})
            else:
                print(f"   [DEBUG] --> Below threshold {RELEVANCE_THRESHOLD}")
        except Exception as e:
            print(f"   [DEBUG] Unpack/Process Error for item {item}: {e}")

    # except Exception as e:
    #     print(f"⚠️ Vector DB Error: {e}")
    #     matches = []

    if not matches:
        print("⚠️ No matches found. Falling back to Web Search.")
        web_results = search_web(user_query)
        # ... fallback logic existing ...
        context = f"Web Search Results:\n{web_results}"
        source_label = "Web Search"
    else:
        print(f"✅ Found {len(matches)} matches in Knowledge Base.")
        context = "\n\n".join([m["text"] for m in matches])
        source_label = "RAG Knowledge Base [Supabase]"

    structured_prompt = f"""
You are a highly qualified nutritionist and food scientist. 
Your task is to analyze the user's query about an ingredient using the provided CONTEXT (which includes FDA data, scientific consensus, and safety ratings).

Context:
{context}

Question: {user_query}

Instructions:
1. "answer": Provide a detailed, scientifically-backed summary. Mention specific risks, safe limits, and regulatory status (FDA/EFSA). Do NOT use generic phrases. If the context has the info, use it.
2. "ingredient_details": Extract specific metadata from the context.
   - For 'tags', determine the safety color based on the data:
     - 'Safe' -> 'green'
     - 'Caution' / 'Moderate Risk' -> 'yellow'
     - 'Avoid' / 'High Risk' / 'Banned' -> 'red'

Respond in this JSON format only:
{{
  "answer": {{
    "query": "{user_query}",
    "answer": "PUT_YOUR_DETAILED_SUMMARY_HERE",
    "source": "{source_label}"
  }},
  "ingredient_details": {{
    "name": "Extract from context",
    "category": "Extract from context",
    "source_type": "Natural / Synthetic / etc",
    "recommended_daily_intake": "Extract or N/A",
    "common_uses": ["use1", "use2"],
    "alternatives": ["alt1", "alt2"],
    "tags": [
      {{ "name": "Safety Rating (e.g. GRAS, Caution)", "color": "green/yellow/red" }},
      {{ "name": "Source (e.g. FDA)", "color": "blue" }}
    ]
  }}
}}
"""

    response = client.chat.completions.create(
        model=LLM_MODEL,
        messages=[{"role": "user", "content": structured_prompt}],
        temperature=0,
    )

    return json.loads(response.choices[0].message.content.strip())
