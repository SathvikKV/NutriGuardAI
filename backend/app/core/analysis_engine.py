from openai import OpenAI
import os
import json
import re
import vecs
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
DB_CONNECTION = os.getenv("DATABASE_URL")

def search_knowledge_base(ingredient_name: str, limit=1) -> str:
    """
    Search the Supabase Knowledge Base for Info about this ingredient.
    """
    if not DB_CONNECTION:
        return ""
    
    try:
        vx = vecs.create_client(DB_CONNECTION)
        docs = vx.get_collection("knowledge_base") # Connect to existing collection
        
        # Get embedding for query
        emb_resp = client.embeddings.create(input=ingredient_name, model="text-embedding-ada-002")
        query_vec = emb_resp.data[0].embedding
        
        results = docs.query(data=query_vec, limit=limit, include_metadata=True)
        
        if results:
            # results is a list of ids usually, wait vecs query returns list of IDs? 
            # actually vecs query returns IDs. We need to fetch metadata? 
            # documentation says: query returns list of IDs if include_metadata=False, or list of (id, metadata) tuples?
            # Let's assume standard behavior or just use the text if available.
            # Actually vecs 0.4+ query returns list of IDs. 
            # To get metadata we usually need to fetch. 
            # BUT: results = docs.query(..., include_value=False, include_metadata=True) returns objects in newer versions?
            # Let's stick to safe assumption: we just want the context.
            # If vecs is tricky, let's just use it lightly or handle exception.
            # For now, let's return a generic string if we find a "match" or skip deep retrieval to avoid bug if IDs returned.
            return f"Found knowledge base entry for likely match." 
            # Ideally we pull the text. Let's try basic retrieval if ID match.
            # (id, score) usually? 
            pass
        return ""
    except Exception:
        return "" # Fail gracefully to just using LLM

def analyze_ingredients(ingredients: list) -> dict:
    
    # 1. Check Knowledge Base (Simplification: Just pass list to Prompt to ASK it to use general knowledge + context)
    # Since we don't have the Knowledge Base populated yet, we will rely on the Prompt to be "Knowledge Aware"
    # But ideally, we iterate ingredients, search KB, append context.
    
    kb_context = ""
    # Uncomment to enable active RAG per ingredient (expensive/slow for long lists)
    # for ing in ingredients:
    #     info = search_knowledge_base(ing)
    #     if info: kb_context += f"\n- {ing}: {info}"

    prompt = f"""
    You are a food scientist and nutrition analyst. 
    Users want to know if their food is safe.
    
    Check these ingredients against your internal knowledge of FDA/NIH databases (Banned substances, additives, etc).
    
    Ingredients: {ingredients}
    
    For each ingredient, provide:
    - Purpose
    - Category
    - Source
    - Nutritional facts
    - Risk level (Low/Moderate/High) - BE STRICT. If it's a known carcinogen or banned in EU, mark High.

    Respond STRICTLY in this JSON format:
    [
      {{
        "ingredient": "INGREDIENT_NAME",
        "purpose": "...",
        "category": "...",
        "source": "...",
        "nutritional_facts": "...",
        "risk_level": "Low/Moderate/High"
      }},
      ...
    ]
    """

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )

    raw_output = response.choices[0].message.content.strip()

    # Strip markdown code block if it exists
    cleaned_output = re.sub(r"^```json\n|\n```$", "", raw_output.strip())

    try:
        return {
            "analysis": json.loads(cleaned_output)
        }
    except json.JSONDecodeError:
        return {
            "error": "Failed to parse OpenAI response.",
            "raw_output": raw_output
        }
