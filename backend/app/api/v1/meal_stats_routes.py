# app/api/v1/meal_stats_routes.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.meal import Meal, MealItem
from collections import defaultdict, Counter
from datetime import datetime
import calendar

router = APIRouter(prefix="/api/v1/meals/stats", tags=["Meal Stats"])

@router.get("/{user_id}")
def get_meal_stats(user_id: int, db: Session = Depends(get_db)):
    meals = db.query(Meal).filter(Meal.user_id == user_id).all()
    if not meals:
        return {"message": "No meals found for this user"}

    # Target values (can make user-specific later)
    calorie_target = 2000
    protein_target = 80
    fiber_target = 25  # Assumed – only use if tracked

    daily_stats = defaultdict(lambda: {
        "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "fiber": 0
    })
    food_counter = Counter()

    for meal in meals:
        date_str = meal.meal_time.strftime("%Y-%m-%d")
        daily_stats[date_str]["calories"] += meal.total_calories or 0
        daily_stats[date_str]["protein"] += meal.total_protein or 0
        daily_stats[date_str]["carbs"] += meal.total_carbs or 0
        daily_stats[date_str]["fat"] += meal.total_fat or 0
        if hasattr(meal, "total_fiber"):
            daily_stats[date_str]["fiber"] += meal.total_fiber or 0  # optional

        items = db.query(MealItem).filter(MealItem.meal_id == meal.id).all()
        for item in items:
            food_counter[item.food_name] += 1

    # Convert date_str back to datetime for sorting and weekday labels
    breakdown_list = []
    for date, data in daily_stats.items():
        dt = datetime.strptime(date, "%Y-%m-%d")
        breakdown_list.append((dt, data))

    # Highlights calculation
    most_protein_day = max(breakdown_list, key=lambda x: x[1]["protein"], default=(None, {}))
    best_calorie_balance = min(breakdown_list, key=lambda x: abs(x[1]["calories"] - calorie_target), default=(None, {}))
    most_fiber_day = max(breakdown_list, key=lambda x: x[1].get("fiber", 0), default=(None, {}))

    def format_highlight(dt, value, metric, target):
        return {
            "day": calendar.day_name[dt.weekday()],
            "value": value,
            "percent_of_target": round((value / target) * 100, 1) if target else None,
            "metric": metric
        }

    weekly_highlights = {
        "most_protein_day": format_highlight(most_protein_day[0], most_protein_day[1]["protein"], "protein", protein_target),
        "best_calorie_balance": format_highlight(best_calorie_balance[0], best_calorie_balance[1]["calories"], "calories", calorie_target),
        "most_fiber_day": format_highlight(most_fiber_day[0], most_fiber_day[1].get("fiber", 0), "fiber", fiber_target)
    }

    return {
        "daily_breakdown": {k: dict(v) for k, v in daily_stats.items()},
        "top_foods": food_counter.most_common(5),
        "weekly_highlights": weekly_highlights
    }
