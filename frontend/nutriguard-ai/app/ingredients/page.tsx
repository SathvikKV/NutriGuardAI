"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Upload } from "lucide-react";
import IngredientCard from "@/components/ingredient-card";
import { askNutritionQuestion } from "@/services/api";

interface Tag {
  name: string;
  color: string;
}

interface Ingredient {
  name: string;
  category: string;
  description: string;
  tags: Tag[];
  image: string;
}

interface IngredientTag {
  name: string;
  color: string;
}

interface IngredientDetails {
  name: string;
  category: string;
  source_type: string;
  recommended_daily_intake: string;
  common_uses: string[];
  alternatives: string[];
  tags: IngredientTag[];
}

interface AskAnswer {
  query: string;
  answer: string;
  source?: string;
}

interface AskResponse {
  answer: AskAnswer;
  ingredient_details: IngredientDetails;
}

export default function IngredientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [aiAnswer, setAiAnswer] = useState<AskResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const ingredients: Ingredient[] = [
    // Herbs
    {
      name: "Ashwagandha",
      category: "Herbs",
      description: "Adaptogen herb for stress relief.",
      tags: [{ name: "Adaptogen", color: "green" }],
      image: "/placeholder.svg",
    },
    {
      name: "Turmeric",
      category: "Herbs",
      description: "Anti-inflammatory golden spice.",
      tags: [{ name: "Anti-inflammatory", color: "green" }],
      image: "/placeholder.svg",
    },
    {
      name: "Ginger",
      category: "Herbs",
      description: "Root used for digestion and nausea.",
      tags: [{ name: "Digestive", color: "orange" }],
      image: "/placeholder.svg",
    },
    {
      name: "Echinacea",
      category: "Herbs",
      description: "Boosts immune health.",
      tags: [{ name: "Immune Support", color: "blue" }],
      image: "/placeholder.svg",
    },
    {
      name: "Holy Basil",
      category: "Herbs",
      description: "Balances stress and blood sugar.",
      tags: [{ name: "Adaptogen", color: "green" }],
      image: "/placeholder.svg",
    },

    // Probiotics
    {
      name: "Lactobacillus",
      category: "Probiotics",
      description: "Common probiotic bacteria.",
      tags: [{ name: "Gut Health", color: "purple" }],
      image: "/placeholder.svg",
    },
    {
      name: "Bifidobacterium",
      category: "Probiotics",
      description: "Supports digestion and immunity.",
      tags: [{ name: "Probiotic", color: "purple" }],
      image: "/placeholder.svg",
    },
    {
      name: "Saccharomyces Boulardii",
      category: "Probiotics",
      description: "Beneficial yeast probiotic.",
      tags: [{ name: "Digestive Health", color: "green" }],
      image: "/placeholder.svg",
    },
    {
      name: "Streptococcus Thermophilus",
      category: "Probiotics",
      description: "Used in yogurt fermentation.",
      tags: [{ name: "Gut Flora", color: "blue" }],
      image: "/placeholder.svg",
    },
    {
      name: "Bacillus Coagulans",
      category: "Probiotics",
      description: "Helps gut resilience.",
      tags: [{ name: "Gut Health", color: "green" }],
      image: "/placeholder.svg",
    },

    // Antioxidants
    {
      name: "Vitamin C",
      category: "Antioxidants",
      description: "Essential immune-boosting vitamin.",
      tags: [{ name: "Antioxidant", color: "yellow" }],
      image: "/placeholder.svg",
    },
    {
      name: "Vitamin E",
      category: "Antioxidants",
      description: "Protects cells from oxidative stress.",
      tags: [{ name: "Skin Health", color: "orange" }],
      image: "/placeholder.svg",
    },
    {
      name: "Selenium",
      category: "Antioxidants",
      description: "Mineral antioxidant defense.",
      tags: [{ name: "Immunity", color: "blue" }],
      image: "/placeholder.svg",
    },
    {
      name: "CoQ10",
      category: "Antioxidants",
      description: "Supports heart and mitochondrial health.",
      tags: [{ name: "Heart Health", color: "red" }],
      image: "/placeholder.svg",
    },
    {
      name: "Glutathione",
      category: "Antioxidants",
      description: "Master antioxidant made by the body.",
      tags: [{ name: "Cell Detox", color: "green" }],
      image: "/placeholder.svg",
    },

    // Color Additives
    {
      name: "Red 40",
      category: "Color Additives",
      description: "Artificial coloring often used in foods.",
      tags: [{ name: "Synthetic Dye", color: "red" }],
      image: "/placeholder.svg",
    },
    {
      name: "Yellow 5",
      category: "Color Additives",
      description: "Synthetic lemon yellow dye.",
      tags: [{ name: "Synthetic Dye", color: "yellow" }],
      image: "/placeholder.svg",
    },
    {
      name: "Blue 1",
      category: "Color Additives",
      description: "Bright blue synthetic coloring.",
      tags: [{ name: "Synthetic Dye", color: "blue" }],
      image: "/placeholder.svg",
    },
    {
      name: "Titanium Dioxide",
      category: "Color Additives",
      description: "White pigment used in foods.",
      tags: [{ name: "Color Additive", color: "gray" }],
      image: "/placeholder.svg",
    },
    {
      name: "Caramel Color",
      category: "Color Additives",
      description: "Colorant made by heating sugars.",
      tags: [{ name: "Natural Colorant", color: "brown" }],
      image: "/placeholder.svg",
    },

    // Food Substances
    {
      name: "Citric Acid",
      category: "Food Substances",
      description: "Acidulant used for tart flavor.",
      tags: [{ name: "Preservative", color: "yellow" }],
      image: "/placeholder.svg",
    },
    {
      name: "Maltodextrin",
      category: "Food Substances",
      description: "Carbohydrate from starch.",
      tags: [{ name: "Thickener", color: "orange" }],
      image: "/placeholder.svg",
    },
    {
      name: "Guar Gum",
      category: "Food Substances",
      description: "Thickening agent from guar beans.",
      tags: [{ name: "Stabilizer", color: "green" }],
      image: "/placeholder.svg",
    },
    {
      name: "Sodium Benzoate",
      category: "Food Substances",
      description: "Common preservative.",
      tags: [{ name: "Preservative", color: "blue" }],
      image: "/placeholder.svg",
    },
    {
      name: "Sorbitol",
      category: "Food Substances",
      description: "Sugar alcohol sweetener.",
      tags: [{ name: "Sweetener", color: "purple" }],
      image: "/placeholder.svg",
    },

    // Banned Substances
    {
      name: "Ephedra",
      category: "Banned Substances",
      description: "Banned stimulant formerly used in weight loss.",
      tags: [{ name: "Banned", color: "red" }],
      image: "/placeholder.svg",
    },
    {
      name: "Phenylbutazone",
      category: "Banned Substances",
      description: "NSAID banned in food animals.",
      tags: [{ name: "Banned", color: "red" }],
      image: "/placeholder.svg",
    },
    {
      name: "Ractopamine",
      category: "Banned Substances",
      description: "Banned livestock growth agent.",
      tags: [{ name: "Banned", color: "red" }],
      image: "/placeholder.svg",
    },
    {
      name: "Melamine",
      category: "Banned Substances",
      description: "Illegal food additive causing toxicity.",
      tags: [{ name: "Banned", color: "red" }],
      image: "/placeholder.svg",
    },
    {
      name: "Chloramphenicol",
      category: "Banned Substances",
      description: "Banned antibiotic in animal foods.",
      tags: [{ name: "Banned", color: "red" }],
      image: "/placeholder.svg",
    },
  ];

  const categories = [
    "All",
    "Herbs",
    "Probiotics",
    "Antioxidants",
    "Color Additives",
    "Food Substances",
    "Banned Substances",
  ];

  const handleAsk = async () => {
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      setAiAnswer(null);

      const response = await askNutritionQuestion(searchQuery);
      const { answer } = response.data as { answer: AskResponse };
      setAiAnswer(answer);
    } catch (err) {
      console.error("Failed to get response from AI:", err);
      setAiAnswer({
        answer: {
          query: searchQuery,
          answer: "Sorry, I couldn't find an answer.",
        },
        ingredient_details: {
          name: searchQuery,
          category: "Unknown",
          source_type: "Unknown",
          recommended_daily_intake: "N/A",
          common_uses: [],
          alternatives: [],
          tags: [],
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="bg-accent/30 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary">Ingredients</h1>

          <p className="text-muted-foreground mb-6">
            Browse a curated library of ingredients across different categories
            like Herbs, Probiotics, and Antioxidants. You can also search for a
            specific ingredient and learn about its health effects, uses, and
            risks.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Ask about an ingredient..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
            </div>
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleAsk}
            disabled={loading}
          >
            {loading ? (
              "Thinking..."
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span>Search</span>
              </>
            )}
          </Button>
        </div>

        {aiAnswer && (
          <div className="mb-10 p-6 border-2 border-primary/20 rounded-2xl bg-white text-base text-foreground shadow-lg">
            <h2 className="text-xl font-bold text-primary mb-4">AI Answer</h2>
            <p className="mb-4 leading-relaxed">{aiAnswer.answer.answer}</p>

            {aiAnswer.answer.source && (
              <p className="text-sm mb-4">
                <strong className="text-muted-foreground">Source:</strong>{" "}
                <span className="text-blue-600 underline">
                  {aiAnswer.answer.source}
                </span>
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p>
                <strong>Name:</strong> {aiAnswer.ingredient_details.name}
              </p>
              <p>
                <strong>Category:</strong>{" "}
                {aiAnswer.ingredient_details.category}
              </p>
              <p>
                <strong>Source Type:</strong>{" "}
                {aiAnswer.ingredient_details.source_type}
              </p>
              <p>
                <strong>Daily Intake:</strong>{" "}
                {aiAnswer.ingredient_details.recommended_daily_intake}
              </p>
              <p>
                <strong>Uses:</strong>{" "}
                {aiAnswer.ingredient_details.common_uses.join(", ")}
              </p>
              <p>
                <strong>Alternatives:</strong>{" "}
                {aiAnswer.ingredient_details.alternatives.join(", ")}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {aiAnswer.ingredient_details.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`text-xs font-medium px-3 py-1 rounded-full bg-${tag.color}-100 text-${tag.color}-800 border border-${tag.color}-200`}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category, index) => (
            <Button
              key={index}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ingredients
            .filter((ingredient) =>
              selectedCategory === "All"
                ? true
                : ingredient.category === selectedCategory
            )
            .map((ingredient, index) => (
              <IngredientCard key={index} ingredient={ingredient} />
            ))}
        </div>
      </div>
    </div>
  );
}
