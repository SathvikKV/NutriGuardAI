from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential
import io
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

endpoint = "https://nutriguard-ocr.cognitiveservices.azure.com/"
key = "EZ8Zgf4WIYMiVTwSYMlN7QZJMYcPdbk6Xgbq2imwJXuFgxgqeiOdJQQJ99BDACYeBjFXJ3w3AAALACOGqqxE"

client = DocumentAnalysisClient(endpoint, AzureKeyCredential(key))

def extract_text_from_image(image_bytes: bytes) -> str:
    poller = client.begin_analyze_document("prebuilt-read", document=image_bytes)
    result = poller.result()

    extracted_text = ""

    for page in result.pages:
        for line in page.lines:
            extracted_text += line.content + " "

    return extracted_text.strip()
