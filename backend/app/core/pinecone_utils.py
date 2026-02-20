# app/core/pinecone_utils.py
# Deprecated: Replaced by Supabase Vecs

# from pinecone import Pinecone, PodSpec

def upsert_embeddings(vectors, index_name=None):
    print("Pinecone disabled. Skipping upsert.")
    return

def search_embeddings(query_embedding, index_name=None, top_k=10):
    print("Pinecone disabled. Returning empty results.")
    return {"matches": []}

def delete_embedding(vector_id: str, index_name=None):
    print("Pinecone disabled. Skipping delete.")
    return

def generate_embedding(text: str):
    # This is actually OpenAI logic, but keeping stub here if imported
    return []