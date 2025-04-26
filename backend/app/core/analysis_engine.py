from openai import OpenAI
import os
from dotenv import load_dotenv
import json
import re

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def analyze_ingredients(ingredients: list) -> dict:
    prompt = f"""
You are a food scientist and nutrition analyst. For each ingredient below, provide the following information:
- Purpose in food products (why it's used)
- Classification/category (e.g. additive, sweetener, preservative)
- Source (natural/artificial, plant/animal/mineral origin)
- Nutritional facts (relevant benefits or caloric content if applicable)
- Risk level (Low/Moderate/High)

Respond STRICTLY in this JSON format:
[
  {{
    "ingredient": "INGREDIENT_NAME",
    "purpose": "...",
    "category": "...",
    "source": "...",
    "nutritional_facts": "...",
    "risk_level": "Low/Moderate/High"
  }},
  ...
]

Ingredients: {ingredients}
"""

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )

    raw_output = response.choices[0].message.content.strip()

    # Strip markdown code block if it exists
    cleaned_output = re.sub(r"^```json\n|\n```$", "", raw_output.strip())

    try:
        return {
            "analysis": json.loads(cleaned_output)
        }
    except json.JSONDecodeError:
        return {
            "error": "Failed to parse OpenAI response. Here is the raw output for debugging.",
            "raw_output": raw_output
        }
