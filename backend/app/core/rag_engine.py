import os
import json
from dotenv import load_dotenv
from openai import OpenAI
from app.core.pinecone_utils import search_embeddings
from app.core.web_search import search_web

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

EMBEDDING_MODEL = "text-embedding-ada-002"
LLM_MODEL = "gpt-3.5-turbo"
RELEVANCE_THRESHOLD = 0.75

def get_query_embedding(query: str) -> list:
    response = client.embeddings.create(
        input=query,
        model=EMBEDDING_MODEL
    )
    return response.data[0].embedding

def generate_rag_response(user_query: str) -> dict:
    query_embedding = get_query_embedding(user_query)
    search_results = search_embeddings(query_embedding, top_k=5)
    matches = search_results.get("matches", [])
    relevant_matches = [m for m in matches if m["score"] >= RELEVANCE_THRESHOLD]

    if not relevant_matches:
        web_results = search_web(user_query)
        fallback_prompt = f"""
You are a nutrition expert. Provide a structured JSON about the ingredient: {user_query}.

Respond STRICTLY in this format:
{{
  "answer": {{
    "query": "...",
    "answer": "...",
    "source": "Web Search"
  }},
  "ingredient_details": {{
    "name": "...",
    "category": "...",
    "source_type": "...",
    "recommended_daily_intake": "...",
    "common_uses": ["...", "..."],
    "alternatives": ["...", "..."],
    "tags": [
      {{ "name": "...", "color": "..." }},
      ...
    ]
  }}
}}
"""
        response = client.chat.completions.create(
            model=LLM_MODEL,
            messages=[{"role": "user", "content": fallback_prompt}],
            temperature=0,
        )
        return json.loads(response.choices[0].message.content.strip())

    context_chunks = []
    total_chars = 0
    for match in relevant_matches:
        chunk = match["metadata"]["text"]
        if total_chars + len(chunk) <= 3000:
            context_chunks.append(chunk)
            total_chars += len(chunk)

    context = "\n\n".join(context_chunks)
    structured_prompt = f"""
You are a certified nutritionist. Based on the CONTEXT below, return a JSON object that includes:
1. An informative answer about the user's query.
2. A structured "ingredient_details" object with:
   - name, category, source_type
   - recommended_daily_intake
   - common_uses
   - alternatives
   - tags: [{{ "name": string, "color": string }}]

Context:
{context}

Question: {user_query}

Respond in this JSON format only:
{{
  "answer": {{
    "query": "...",
    "answer": "...",
    "source": "RAG Knowledge Base"
  }},
  "ingredient_details": {{
    "name": "...",
    "category": "...",
    "source_type": "...",
    "recommended_daily_intake": "...",
    "common_uses": ["...", "..."],
    "alternatives": ["...", "..."],
    "tags": [
      {{ "name": "...", "color": "..." }},
      ...
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
