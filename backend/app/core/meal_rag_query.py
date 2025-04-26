# File: app/core/meal_rag_query.py

from openai import OpenAI
from app.core.pinecone_utils import search_embeddings
from app.core.meal_rag_ingest import get_meal_embedding
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

EMBEDDING_MODEL = "text-embedding-ada-002"
LLM_MODEL = "gpt-3.5-turbo"
MAX_CONTEXT_CHARS = 6000
RELEVANCE_THRESHOLD = 0.6  # reduced for more flexible matching


def get_query_embedding(query: str):
    response = client.embeddings.create(input=query, model=EMBEDDING_MODEL)
    return response.data[0].embedding


def truncate_context(texts: list[str], max_chars: int = MAX_CONTEXT_CHARS) -> str:
    output = []
    total = 0
    for t in texts:
        if total + len(t) > max_chars:
            break
        output.append(t)
        total += len(t)
    return "\n\n".join(output)


def search_meals_with_rag(user_id: int, query: str):
    embedding = get_meal_embedding(query)
    results = search_embeddings(
        query_embedding=embedding,
        index_name=os.getenv("PINECONE_MEAL_INDEX")  # meal-tracker-index
    )

    matches = results.get("matches", [])
    relevant_matches = [m for m in matches if m["score"] >= RELEVANCE_THRESHOLD]

    # Optional: Debugging
    print("\n--- Top Match Debug ---")
    for m in relevant_matches:
        print(f"> Score: {m['score']:.3f}")
        print(f"Text:\n{m['metadata'].get('text', '')}\n")

    context_snippets = [m["metadata"]["text"] for m in relevant_matches if "text" in m["metadata"]]
    context = truncate_context(context_snippets)

    if not context:
        return {
            "query": query,
            "answer": "Not enough relevant meal history found to answer the question.",
            "source": "Meal RAG"
        }

    prompt = f"""
You are a helpful and friendly AI assistant helping a user recall and understand their recent meals.

Use the past meal logs below to answer the question with useful insights. Be conversational but accurate. If any dates are mentioned, try to match them from the logs.

Meal Logs:
{context}

User Question: {query}

Your Answer:
    """

    response = client.chat.completions.create(
        model=LLM_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )

    return {
        "query": query,
        "answer": response.choices[0].message.content.strip(),
        "source": "Meal RAG"
    }
