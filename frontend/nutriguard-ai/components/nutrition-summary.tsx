import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function NutritionSummary() {
  // Sample nutrition data
  const nutritionData = {
    calories: { current: 1450, target: 2000 },
    protein: { current: 85, target: 120 },
    carbs: { current: 145, target: 200 },
    fat: { current: 48, target: 65 },
    micronutrients: [
      { name: "Vitamin D", percentage: 65 },
      { name: "Calcium", percentage: 42 },
      { name: "Iron", percentage: 78 },
      { name: "Potassium", percentage: 35 },
    ],
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Today's Nutrition</h2>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Calories</span>
              <span>
                {nutritionData.calories.current} / {nutritionData.calories.target} kcal
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${(nutritionData.calories.current / nutritionData.calories.target) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Protein</span>
              <span>
                {nutritionData.protein.current}g / {nutritionData.protein.target}g
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${(nutritionData.protein.current / nutritionData.protein.target) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Carbs</span>
              <span>
                {nutritionData.carbs.current}g / {nutritionData.carbs.target}g
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${(nutritionData.carbs.current / nutritionData.carbs.target) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Fat</span>
              <span>
                {nutritionData.fat.current}g / {nutritionData.fat.target}g
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${(nutritionData.fat.current / nutritionData.fat.target) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-medium mb-2">Micronutrients</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {nutritionData.micronutrients.map((nutrient, index) => (
                <div key={index}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{nutrient.name}</span>
                    <span>{nutrient.percentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${nutrient.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button variant="outline" className="w-full mt-2">
            View Journal
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
