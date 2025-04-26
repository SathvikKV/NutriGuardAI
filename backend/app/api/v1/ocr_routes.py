# app/api/v1/ocr_routes.py

from fastapi import APIRouter, UploadFile, File, HTTPException
from app.core import ocr_engine, ingredient_parser, analysis_engine
from app.core.analysis_summary_engine import generate_product_summary
from app.schemas.ocr import NutritionSummaryRequest  # ✅ import schema

router = APIRouter(tags=["OCR"])

@router.post("/label")
async def extract_label_text(image: UploadFile = File(...)):
    try:
        contents = await image.read()
        extracted_text = ocr_engine.extract_text_from_image(contents)
        ingredients = ingredient_parser.extract_ingredients(extracted_text)

        # Analyze each ingredient
        analysis = analysis_engine.analyze_ingredients(ingredients)

        return {
            "extracted_text": extracted_text,
            "ingredients": ingredients,
            "analysis": analysis.get("analysis") if "analysis" in analysis else analysis
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/summary")
async def get_nutrition_summary(payload: NutritionSummaryRequest):  # ✅ use Pydantic model
    try:
        summary = generate_product_summary(
            payload.product_name,
            payload.ingredients,
            payload.analysis
        )
        return {
            "product_name": payload.product_name,
            "summary": summary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
