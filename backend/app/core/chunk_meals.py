# app/core/chunk_meals.py

def format_meal_as_text(meal, items):
    formatted_items = []
    for item in items:
        formatted_items.append(
            f"{item.food_name} ({item.quantity}) provided {item.calories} kcal, "
            f"{item.protein}g protein, {item.carbs}g carbs, {item.fat}g fat."
        )

    item_summary = " ".join(formatted_items)

    return f"""
On {meal.meal_time.strftime('%A, %B %d, %Y')} for {meal.meal_type.lower()}, you had a meal called '{meal.meal_name}'.
Here are the details:
{item_summary}

This meal totaled {meal.total_calories} kcal with {meal.total_protein}g protein, {meal.total_carbs}g carbs, and {meal.total_fat}g fat.
Notes: {meal.notes or 'None'}.
    """.strip()
