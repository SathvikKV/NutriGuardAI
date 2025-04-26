from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.rag_engine import generate_rag_response

router = APIRouter(tags=["RAG Ask"])

# Request Body Model
class AskQuery(BaseModel):
    query: str

@router.post("/ask")
async def ask_question(payload: AskQuery):
    try:
        answer = generate_rag_response(payload.query)
        return {
            "question": payload.query,
            "answer": answer
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
