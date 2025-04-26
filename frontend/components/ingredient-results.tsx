import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

interface IngredientAnalysis {
  ingredient: string;
  purpose?: string;
  category?: string;
  risk_level?: string;
  nutritional_facts?: string;
}

interface Props {
  analysis: IngredientAnalysis[];
  summary?: string | null;
}

export default function IngredientResults({ analysis, summary }: Props) {
  console.log("✅ Received analysis:", analysis);
  console.log("✅ Received summary:", summary);
  console.log("🎯 Rendering IngredientResults with:", analysis, summary);

  if (!Array.isArray(analysis) || analysis.length === 0) {
    return (
      <div className="text-sm text-muted-foreground mt-4 text-center">
        ⚠️ No ingredient analysis found.
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Ingredient Analysis</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {analysis.map((item, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-semibold">
                    {item.ingredient || "Unknown"}
                  </CardTitle>
                  {item.risk_level === "Low" && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Low Risk
                    </Badge>
                  )}
                  {item.risk_level === "Moderate" && (
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      Moderate Risk
                    </Badge>
                  )}
                  {item.risk_level === "High" && (
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      High Risk
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {item.purpose || "No description available."}
                </p>
                {item.nutritional_facts && (
                  <p className="text-xs text-muted-foreground mt-2">
                    <strong>Nutrition:</strong> {item.nutritional_facts}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {summary && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Nutritionist Summary</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
              {summary}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
