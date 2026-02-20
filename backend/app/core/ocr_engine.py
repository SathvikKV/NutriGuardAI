import os
import boto3
from dotenv import load_dotenv

load_dotenv()

# AWS Configuration
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

def extract_text_from_image(image_bytes: bytes) -> str:
    """
    Extracts text from an image using AWS Textract.
    """
    try:
        client = boto3.client(
            "textract",
            region_name=AWS_REGION,
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY
        )

        response = client.detect_document_text(
            Document={'Bytes': image_bytes}
        )

        extracted_text = ""
        for item in response.get("Blocks", []):
            if item["BlockType"] == "LINE":
                extracted_text += item["Text"] + "\n"
        
        return extracted_text.strip()

    except Exception as e:
        print(f"AWS Textract Error: {e}")
        raise RuntimeError(f"Failed to extract text using Textract: {str(e)}")
