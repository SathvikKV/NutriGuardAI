"use client";

import { useState } from "react";
import { Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IngredientResults from "@/components/ingredient-results";
import FileUpload from "@/components/file-upload";
import {
  uploadLabelForOCR,
  getOcrIngredientSummary,
  getIngredientAnalysis,
} from "@/services/api";

export default function Home() {
  const [textInput, setTextInput] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<any[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const clearResults = () => {
    setIngredients([]);
    setAnalysis([]);
    setSummary(null);
  };

  const handleAnalyzeText = async () => {
    try {
      setLoading(true);
      clearResults();
      const parsed = textInput
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean);

      const response = await getIngredientAnalysis(parsed);
      const { analysis } = response.data as { analysis: any[] };

      setIngredients(parsed);
      setAnalysis(analysis || []);
    } catch (error) {
      console.error("Text analysis error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setLoading(true);
      clearResults();
      const formData = new FormData();
      formData.append("image", file);

      const ocrResponse = await uploadLabelForOCR(formData);
      const { ingredients, analysis } = ocrResponse.data as {
        ingredients: string[];
        analysis: any[];
      };

      console.log("✅ OCR Analysis:", analysis);

      const summaryResponse = await getOcrIngredientSummary(
        ingredients,
        "Custom Product",
        analysis
      );
      const { summary } = summaryResponse.data as { summary: string };

      console.log("✅ Final Summary:", summary);

      setIngredients(ingredients || []);
      setAnalysis(analysis || []);
      setSummary(summary || null);
    } catch (error) {
      console.error("OCR upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-accent/30 min-h-screen">
      <div className="py-12 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-primary mb-2">
            NutriGuard AI
          </h1>
          <p className="text-muted-foreground mb-8">
            Your AI-powered Nutrition & Ingredient Assistant for healthier
            choices
          </p>

          <div className="max-w-3xl mx-auto">
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
                <TabsTrigger value="upload">Image Upload</TabsTrigger>
                <TabsTrigger value="text">Text Input</TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Enter Ingredients List
                    </h2>
                    <Textarea
                      placeholder="Enter ingredients (e.g., Water, Sucralose, Citric Acid...)"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      className="min-h-[150px] mb-4"
                    />
                    <Button
                      onClick={handleAnalyzeText}
                      disabled={loading}
                      className="w-full sm:w-auto"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      {loading ? "Analyzing..." : "Analyze Ingredients"}
                    </Button>
                  </CardContent>
                </Card>

                {loading && (
                  <p className="text-center text-muted-foreground text-sm animate-pulse">
                    Analyzing ingredients...
                  </p>
                )}

                {!loading && analysis.length > 0 && (
                  <IngredientResults analysis={analysis} summary={summary} />
                )}
              </TabsContent>

              <TabsContent value="upload" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Upload Ingredients List
                    </h2>
                    <FileUpload
                      isImageOnly={true}
                      onUpload={handleImageUpload}
                    />
                  </CardContent>
                </Card>

                {loading && (
                  <p className="text-center text-muted-foreground text-sm animate-pulse">
                    Analyzing image...
                  </p>
                )}

                {!loading && analysis.length > 0 && (
                  <IngredientResults analysis={analysis} summary={summary} />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* ✅ Popular Features Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-primary">
            Popular Features
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Upload className="h-5 w-5" />
                </div>
                <h3 className="font-medium">Label OCR Upload</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Upload a food label image to extract and analyze ingredients
                automatically.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <a href="/upload">Try Label OCR</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  {/* Meal Logger Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                    <path d="M7 2v20" />
                    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
                  </svg>
                </div>
                <h3 className="font-medium">Meal Logger</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Track your meals and monitor your nutritional intake with
                detailed analytics.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <a href="/meals">Log Meals</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  {/* AI Chat Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <path d="M13 8H7" />
                    <path d="M17 12H7" />
                  </svg>
                </div>
                <h3 className="font-medium">AI Nutritionist</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Chat with our AI nutritionist for personalized advice and
                answers to your nutrition questions.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <a href="/chat">Ask Questions</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
