import re

def extract_ingredients(raw_text: str) -> list:
    # Find the line where ingredients start
    match = re.search(r'INGREDIENTS[:]?(.+)', raw_text, re.IGNORECASE)

    if not match:
        return []

    ingredients_text = match.group(1)

    # Split by comma
    ingredients = [item.strip() for item in ingredients_text.split(',')]

    return ingredients
