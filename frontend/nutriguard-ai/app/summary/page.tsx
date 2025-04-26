"use client";

import { useEffect, useState } from "react";
import { getUserId } from "@/lib/auth";
import { getMealStats, getMealSummary } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Award, List, Bot } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function SummaryPage() {
  const [summaryText, setSummaryText] = useState("");
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchSummaryData = async () => {
      const userId = getUserId();
      if (!userId) return;

      const [statsRes, summaryRes] = await Promise.all([
        getMealStats(userId),
        getMealSummary(userId),
      ]);

      setStats(statsRes.data);
      if (
        typeof summaryRes.data === "object" &&
        summaryRes.data !== null &&
        "summary" in summaryRes.data
      ) {
        setSummaryText((summaryRes.data as any).summary);
      } else {
        console.warn("Unexpected summary response structure", summaryRes.data);
      }
    };

    fetchSummaryData();
  }, []);

  const average = (values: number[]) => {
    const sum = values.reduce((acc, v) => acc + v, 0);
    return Math.round(sum / values.length);
  };

  const daily = stats?.daily_breakdown || {};
  const days = Object.keys(daily);

  const avgCalories = average(days.map((d) => daily[d].calories));
  const avgProtein = average(days.map((d) => daily[d].protein));
  const avgCarbs = average(days.map((d) => daily[d].carbs));
  const avgFat = average(days.map((d) => daily[d].fat));

  const highlights = stats?.weekly_highlights || {};
  const topFoods = stats?.top_foods || [];

  return (
    <div className="bg-accent/30 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary">Meal Summary</h1>
          <p className="text-muted-foreground">
            View insights and trends from your meal tracking data
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Daily Calories
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgCalories} </div>
              <p className="text-xs text-muted-foreground">
                Target: 2,000 calories
              </p>
              <Progress value={(avgCalories / 2000) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Daily Protein
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgProtein}g</div>
              <p className="text-xs text-muted-foreground">
                Target: 100g protein
              </p>
              <Progress value={(avgProtein / 100) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Daily Carbs
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgCarbs}g</div>
              <p className="text-xs text-muted-foreground">
                Target: 250g carbs
              </p>
              <Progress value={(avgCarbs / 250) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Daily Fat
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgFat}g</div>
              <p className="text-xs text-muted-foreground">Target: 65g fat</p>
              <Progress value={(avgFat / 65) * 100} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg">Weekly Highlights</CardTitle>
              <Award className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Most Protein-Rich Day</h3>
                <p className="text-sm text-muted-foreground">
                  {highlights?.most_protein_day?.day} -{" "}
                  {highlights?.most_protein_day?.value}g protein (
                  {highlights?.most_protein_day?.percent_of_target}% of your
                  target)
                </p>
              </div>
              <div>
                <h3 className="font-medium">Best Calorie Balance</h3>
                <p className="text-sm text-muted-foreground">
                  {highlights?.best_calorie_balance?.day} -{" "}
                  {highlights?.best_calorie_balance?.value} calories (
                  {highlights?.best_calorie_balance?.percent_of_target}% of your
                  target)
                </p>
              </div>
              <div>
                <h3 className="font-medium">Highest Fiber Day</h3>
                <p className="text-sm text-muted-foreground">
                  {highlights?.most_fiber_day?.day} -{" "}
                  {highlights?.most_fiber_day?.value}g fiber (
                  {highlights?.most_fiber_day?.percent_of_target}% of your
                  target)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg">Common Ingredients</CardTitle>
              <List className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topFoods.map(([food, count]: any, idx: number) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{food}</span>
                      <span className="text-sm text-muted-foreground">
                        {count} meals
                      </span>
                    </div>
                    <Progress
                      value={(count / topFoods[0][1]) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg">AI Nutrition Insights</CardTitle>
            <Bot className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summaryText.split("\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
