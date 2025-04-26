import os
from dotenv import load_dotenv
from pinecone import Pinecone, PodSpec  # For non-serverless (Starter Tier)

load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENV = os.getenv("PINECONE_ENV")
PINECONE_INDEX = os.getenv("PINECONE_INDEX")

# Initialize Pinecone Client
pc = Pinecone(api_key=PINECONE_API_KEY)

# Connect to existing index
index = pc.Index(PINECONE_INDEX)

# Insert vectors
def upsert_embeddings(vectors: list, index_name=None):
    """
    vectors = [(id, embedding, metadata), ...]
    """
    target_index = pc.Index(index_name or os.getenv("PINECONE_INDEX"))
    target_index.upsert(vectors=vectors)


# Search vectors
def search_embeddings(query_embedding, index_name=None, top_k=10):
    if not index_name:
        index_name = os.getenv("PINECONE_INDEX")  # fallback default

    index = pc.Index(index_name)

    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )

    return results