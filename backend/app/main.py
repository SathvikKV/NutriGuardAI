from fastapi import FastAPI
from app.api.v1 import ocr_routes
from app.api.v1 import ocr_routes, ask_routes
from app.api.v1 import analyze_routes
from app.api.v1 import user_routes
from app.api.v1 import meal_routes
from app.api.v1 import meal_rag_routes
from app.api.v1 import meal_stats_routes
from app.api.v1 import meal_summary_routes
from app.api.v1 import macro_routes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="NutriGuard AI API",
    description="Backend API for NutriGuard AI - Nutrition & Ingredient Assistant",
    version="1.0.0",
)

# Allow frontend (Vercel) to call API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev only, restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include OCR routes
app.include_router(ocr_routes.router, prefix="/api/v1/ocr")
app.include_router(ocr_routes.router, prefix="/api/v1/ocr")
app.include_router(ask_routes.router, prefix="/api/v1")
app.include_router(analyze_routes.router, prefix="/api/v1")

app.include_router(user_routes.router, prefix="/api/v1/user")
app.include_router(meal_routes.router, prefix="/api/v1")

app.include_router(macro_routes.router)
app.include_router(meal_rag_routes.router, prefix="/api/v1")
app.include_router(meal_stats_routes.router)
app.include_router(meal_summary_routes.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "NutriGuard AI Backend Running!"}
