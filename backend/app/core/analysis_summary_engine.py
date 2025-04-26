# app/core/analysis_summary_engine.py

from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_product_summary(product_name: str, ingredients: list, analysis: list) -> str:
    prompt = f"""
You are a certified nutritionist assistant. A user has submitted the ingredients and analysis for a product called "{product_name}".

The ingredients are:
{', '.join(ingredients)}

Here is the detailed analysis of each ingredient (in JSON-like format):
{analysis}

Write a 3-4 paragraph explanation for the user that:
1. Describes what the product is and why these ingredients are used.
2. Explains whether the product is balanced or contains concerning components.
3. Suggests healthier alternatives (if relevant) but does NOT tell the user to avoid the product.
4. Uses a friendly, informative tone.

Begin with: "Here’s what I found about {product_name}..."
"""

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
    )

    return response.choices[0].message.content.strip()
