# app/api/v1/meal_rag_routes.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.meal_rag_ingest import ingest_user_meals
from app.core.meal_rag_query import search_meals_with_rag


router = APIRouter(tags=["Meal RAG"])

@router.post("/meals/ingest/{user_id}")
def ingest_user_meals_rag(user_id: int, db: Session = Depends(get_db)):
    try:
        result = ingest_user_meals(db, user_id)
        return {"message": "Meal logs embedded and stored", "details": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/meals/query/{user_id}")
def rag_query_meals(user_id: int, query: str, db: Session = Depends(get_db)):
    result = search_meals_with_rag(user_id=user_id, query=query)
    return {"query": query, "results": result}
