import os
import uuid
from openai import OpenAI
from dotenv import load_dotenv
from app.core.pinecone_utils import upsert_embeddings
import tiktoken

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
EMBEDDING_MODEL = "text-embedding-ada-002"

DATA_FILES = [
    ("color_additives.txt", "Color Additives"),
    ("food_substances.txt", "Food Substances"),
    ("scogs.txt", "SCOGS")
]

DATA_DIR = "app/data/processed"

def split_text_into_chunks(text, max_tokens=8000):
    """
    Splits long text into smaller chunks based on token count to fit model limits.
    """
    encoding = tiktoken.encoding_for_model(EMBEDDING_MODEL)
    tokens = encoding.encode(text)

    chunks = []
    for i in range(0, len(tokens), max_tokens):
        chunk_tokens = tokens[i:i + max_tokens]
        chunk_text = encoding.decode(chunk_tokens)
        chunks.append(chunk_text)
    return chunks

def embed_and_upload():
    vectors = []

    for file_name, source_name in DATA_FILES:
        file_path = os.path.join(DATA_DIR, file_name)
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        paragraphs = [chunk.strip() for chunk in content.split("\n\n") if chunk.strip()]
        for paragraph in paragraphs:
            subchunks = split_text_into_chunks(paragraph)

            for sub in subchunks:
                try:
                    embedding = client.embeddings.create(input=sub, model=EMBEDDING_MODEL).data[0].embedding
                    vector = (
                        f"chunk-{uuid.uuid4().hex[:8]}",
                        embedding,
                        {"text": sub, "source": source_name}
                    )
                    vectors.append(vector)
                except Exception as e:
                    print(f"⚠️ Failed to embed a chunk: {e}")

    upsert_embeddings(vectors)
    print(f"✅ Uploaded {len(vectors)} chunks to Pinecone.")

if __name__ == "__main__":
    embed_and_upload()
