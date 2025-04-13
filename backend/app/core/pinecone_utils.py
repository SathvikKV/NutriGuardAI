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
def upsert_embeddings(vectors: list):
    """
    vectors = [(id, embedding, metadata), ...]
    """
    index.upsert(vectors=vectors)

# Search vectors
def search_embeddings(query_embedding: list, top_k=5):
    result = index.query(vector=query_embedding, top_k=top_k, include_metadata=True)
    return result
