"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getUserId } from "@/lib/auth";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Edit, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MealForm from "@/components/meal-form";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MacrosResponse {
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
}

export default function MealsPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState<any>(null);
  const [meals, setMeals] = useState<any[]>([]);

  const todayTotals = meals.reduce(
    (acc, meal) => {
      acc.calories += meal.total_calories || 0;
      acc.protein += meal.total_protein || 0;
      acc.carbs += meal.total_carbs || 0;
      acc.fat += meal.total_fat || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Example daily goals (you can make these dynamic later if you want)
  const dailyGoals = {
    calories: 2000,
    protein: 120,
    carbs: 200,
    fat: 65,
  };

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      router.push("/login");
    } else {
      fetchMeals(userId);
    }
  }, [router, currentDate]);

  const fetchMeals = async (userId: number) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/meals/user/${userId}`
      );
      const filteredMeals = (res.data as any[]).filter((meal) => {
        const mealDate = new Date(meal.meal_time);
        return (
          mealDate.getDate() === currentDate.getDate() &&
          mealDate.getMonth() === currentDate.getMonth() &&
          mealDate.getFullYear() === currentDate.getFullYear()
        );
      });
      setMeals(filteredMeals);
    } catch (err) {
      console.error("Error fetching meals:", err);
    }
  };

  const handlePreviousDay = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setCurrentDate(prevDate);
  };

  const handleNextDay = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setCurrentDate(nextDate);
  };

  const handleAddMeal = () => {
    setEditingMeal(null);
    setShowForm(true);
  };

  const handleEditMeal = (meal: any) => {
    setEditingMeal(meal);
    setShowForm(true);
  };

  const handleDeleteMeal = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/meals/${id}`);
      setMeals(meals.filter((meal) => meal.id !== id));
    } catch (err) {
      console.error("Failed to delete meal:", err);
    }
  };

  const handleSaveMeal = async (meal: any) => {
    const userId = getUserId();
    if (!userId) return;

    const formattedTime = new Date(meal.time || currentDate).toISOString();

    try {
      const macroRes = await axios.post<MacrosResponse>(
        "http://localhost:8000/meals/generate-macros",
        {
          meal_name: meal.name,
          meal_type: meal.type,
          meal_time: formattedTime,
          notes: meal.notes || "",
          quantity: meal.quantity || "1 serving",
        }
      );

      const macros: MacrosResponse = macroRes.data;
      console.log("[Generated Macros]", macros);

      const payload = {
        meal_name: meal.name,
        meal_type: meal.type,
        meal_time: formattedTime,
        notes: meal.notes || "",
        user_id: userId,
        total_calories: macros.total_calories,
        total_protein: macros.total_protein,
        total_carbs: macros.total_carbs,
        total_fat: macros.total_fat,
        items: [
          {
            food_name: meal.name,
            quantity: meal.quantity || "1 serving",
            calories: macros.total_calories,
            protein: macros.total_protein,
            carbs: macros.total_carbs,
            fat: macros.total_fat,
          },
        ],
      };

      const res = await axios.post(
        "http://localhost:8000/api/v1/meals/",
        payload
      );
      console.log("[Saved Meal]", res.data);

      setMeals((prev) => [...prev, res.data]);
      setShowForm(false);
    } catch (err: any) {
      if (
        axios &&
        typeof err === "object" &&
        "isAxiosError" in axios &&
        (axios as any).isAxiosError(err)
      ) {
        console.error(
          "Axios error response:",
          JSON.stringify(err.response?.data, null, 2)
        );
      } else {
        console.error("Failed to save meal:", err);
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="bg-accent/30 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary">Nutrition Journal</h1>
          <p className="text-muted-foreground">
            Track your daily nutrition and supplement intake
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePreviousDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">{formatDate(currentDate)}</div>
            <Button variant="outline" size="icon" onClick={handleNextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleAddMeal}>
              <Plus className="h-4 w-4 mr-1" /> Add Meal
            </Button>
          </div>
        </div>

        {showForm ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingMeal ? "Edit Meal" : "Add New Meal"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MealForm
                initialData={editingMeal}
                onSave={handleSaveMeal}
                onCancel={() => setShowForm(false)}
              />
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="list" className="w-full mb-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4 pt-4">
              {meals.length === 0 ? (
                <Card>
                  <CardContent className="py-6 text-center text-muted-foreground">
                    No meals logged yet. Click "Add Meal" to get started.
                  </CardContent>
                </Card>
              ) : (
                meals.map((meal) => (
                  <Card key={meal.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge className="mb-2">{meal.meal_type}</Badge>
                          <CardTitle className="text-lg">
                            {meal.meal_name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {new Date(meal.meal_time).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditMeal(meal)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteMeal(meal.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {meal.notes && (
                        <p className="text-sm mb-2">{meal.notes}</p>
                      )}
                      <div className="space-y-2">
                        {meal.items.map((item: any, idx: number) => (
                          <div key={idx} className="text-sm">
                            <div className="flex justify-between">
                              <span className="font-medium">
                                {item.food_name}
                              </span>
                              <span>{item.quantity}</span>
                            </div>
                            <div className="text-xs text-muted-foreground flex space-x-2">
                              <span>{item.calories} cal</span>
                              <span>P: {item.protein}g</span>
                              <span>C: {item.carbs}g</span>
                              <span>F: {item.fat}g</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="table" className="pt-4">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Calories</TableHead>
                          <TableHead>Protein</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {meals.map((meal) => {
                          const totalCalories = meal.total_calories || 0;
                          const totalProtein = meal.total_protein || 0;

                          return (
                            <TableRow key={meal.id}>
                              <TableCell>{meal.meal_type}</TableCell>
                              <TableCell>{meal.meal_name}</TableCell>
                              <TableCell>
                                {new Date(meal.meal_time).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )}
                              </TableCell>
                              <TableCell>{totalCalories}</TableCell>
                              <TableCell>{totalProtein}g</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditMeal(meal)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteMeal(meal.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Today's Nutrition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    label: "Calories",
                    value: todayTotals.calories,
                    goal: dailyGoals.calories,
                  },
                  {
                    label: "Protein",
                    value: `${todayTotals.protein}g`,
                    goal: dailyGoals.protein,
                  },
                  {
                    label: "Carbs",
                    value: `${todayTotals.carbs}g`,
                    goal: dailyGoals.carbs,
                  },
                  {
                    label: "Fat",
                    value: `${todayTotals.fat}g`,
                    goal: dailyGoals.fat,
                  },
                ].map((item, idx) => {
                  const percent = Math.min(
                    (parseFloat(item.value.toString()) / item.goal) * 100,
                    100
                  );
                  return (
                    <div key={idx}>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        {item.label}
                      </h3>
                      <p className="text-2xl font-bold">{item.value}</p>
                      <div className="w-full bg-muted h-2 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-green-600"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {percent.toFixed(1)}% of {item.goal} goal
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Button variant="outline" asChild>
            <a href="/summary">View Weekly Summary</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
