from fastapi import APIRouter, UploadFile, File, HTTPException
from app.core import ocr_engine

router = APIRouter(tags=["OCR"])

@router.post("/label")
async def extract_label_text(image: UploadFile = File(...)):
    try:
        contents = await image.read()
        extracted_text = ocr_engine.extract_text_from_image(contents)
        return {"extracted_text": extracted_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
