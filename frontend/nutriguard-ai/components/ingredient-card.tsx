"use client";

import { Card, CardContent } from "@/components/ui/card";

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

interface IngredientCardProps {
  ingredient: Ingredient;
}

export default function IngredientCard({ ingredient }: IngredientCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
            <img
              src={ingredient.image || "/placeholder.svg"}
              alt={ingredient.name}
              className="h-10 w-10 object-contain"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-base">{ingredient.name}</h3>
            <p className="text-xs text-muted-foreground mb-1">
              {ingredient.category}
            </p>
            <p className="text-sm mb-2 text-foreground">
              {ingredient.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {ingredient.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 text-xs font-medium rounded-full bg-${tag.color}-100 text-${tag.color}-800 border border-${tag.color}-200`}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
