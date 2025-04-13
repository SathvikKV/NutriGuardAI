import os
from dotenv import load_dotenv
from openai import OpenAI
from app.core.pinecone_utils import search_embeddings

load_dotenv()

OPENAI_API_KEY = ""

print(OPENAI_API_KEY)

client = OpenAI(api_key=OPENAI_API_KEY)

EMBEDDING_MODEL = "text-embedding-ada-002"
LLM_MODEL = "gpt-3.5-turbo"

def get_query_embedding(query: str) -> list:
    response = client.embeddings.create(
        input=query,
        model=EMBEDDING_MODEL
    )
    return response.data[0].embedding

def generate_rag_response(user_query: str) -> str:
    query_embedding = get_query_embedding(user_query)
    search_results = search_embeddings(query_embedding, top_k=5)
    context_chunks = [match['metadata']['text'] for match in search_results['matches']]
    context = "\n".join(context_chunks)

    prompt = f"""
You are a nutrition expert. Use the context below to answer the user's question.
If the answer is not present in the context, say "Information not found in trusted sources."

Context:
{context}

Question: {user_query}

Answer:
"""

    response = client.chat.completions.create(
        model=LLM_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
    )

    return response.choices[0].message.content.strip()
