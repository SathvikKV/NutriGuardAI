import axios from "axios";

const api = axios.create({
  baseURL: "http://52.55.243.230:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// --- OCR & Ingredient Analysis ---

export const uploadLabelForOCR = async (formData: FormData) => {
  return api.post("/ocr/label", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getOcrIngredientSummary = async (
  ingredients: string[],
  product_name = "Custom Product",
  analysis: any[] = []
) => {
  return api.post("/ocr/summary", { ingredients, product_name, analysis });
};

export const getIngredientAnalysis = async (ingredients: string[]) => {
  return api.post("/analyze", { ingredients });
};

// --- Nutrition Q&A (RAG + Web Fallback) ---

export const askNutritionQuestion = async (question: string) => {
  return api.post("/ask", { query: question });
};

// --- Meal Logging ---

export const createMealLog = async (mealData: any) => {
  return api.post("/meals", mealData);
};

export const getMealHistory = async (userId: number | string) => {
  return api.get(`/meals/user/${userId}`);
};

export const deleteMeal = async (mealId: number | string) => {
  return api.delete(`/meals/${mealId}`);
};

export const getMealSummary = async (userId: number | string) => {
  return api.get(`/meals/summary/${userId}`);
};

export const getMealStats = async (userId: number | string) => {
  return api.get(`/meals/stats/${userId}`);
};

export const ingestMealData = async (
  userId: number | string,
  mealData?: any
) => {
  return api.post(`/meals/ingest/${userId}`, mealData || {});
};

export const queryMealInsights = async (
  userId: number | string,
  query: string
) => {
  return api.post(`/meals/query/${userId}?query=${encodeURIComponent(query)}`);
};

export default api;
