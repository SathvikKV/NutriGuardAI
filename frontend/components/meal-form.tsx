"use client";

import type React from "react";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface MealItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealFormProps {
  initialData?: {
    type: string;
    name: string;
    time: string;
    notes: string;
    quantity?: string;
    items: MealItem[];
  } | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

interface MacrosResponse {
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
}

export default function MealForm({
  initialData,
  onSave,
  onCancel,
}: MealFormProps) {
  const [formData, setFormData] = useState({
    type: initialData?.type || "Breakfast",
    name: initialData?.name || "",
    time: initialData?.time
      ? new Date(initialData.time).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
    notes: initialData?.notes || "",
    quantity: initialData?.quantity || "1 serving",
    items: initialData?.items || [
      { name: "", quantity: "", calories: 0, protein: 0, carbs: 0, fat: 0 },
    ],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTypeChange = (value: string) => {
    setFormData({ ...formData, type: value });
  };

  const handleItemChange = (
    index: number,
    field: keyof MealItem,
    value: string | number
  ) => {
    const updatedItems = [...formData.items];
    if (field === "name" || field === "quantity") {
      updatedItems[index][field] = value as string;
    } else {
      updatedItems[index][field] = Number(value) || 0;
    }
    setFormData({ ...formData, items: updatedItems });
  };

  const generateMacros = async () => {
    try {
      const res = await axios.post<MacrosResponse>(
        "http://localhost:8000/meals/generate-macros",
        {
          meal_name: formData.name,
          meal_type: formData.type,
          meal_time: new Date(formData.time).toISOString(),
          notes: formData.notes,
          quantity: formData.quantity,
        }
      );

      const macros = res.data;
      console.log("[Auto-filled Macros]", macros);

      setFormData({
        ...formData,
        items: [
          {
            name: formData.name,
            quantity: formData.quantity,
            calories: macros.total_calories,
            protein: macros.total_protein,
            carbs: macros.total_carbs,
            fat: macros.total_fat,
          },
        ],
      });
    } catch (err) {
      console.error("Failed to generate macros", err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      type: formData.type,
      name: formData.name,
      time: formData.time,
      notes: formData.notes,
      quantity: formData.quantity,
      items: formData.items,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Meal Type</Label>
          <Select value={formData.type} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select meal type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Breakfast">Breakfast</SelectItem>
              <SelectItem value="Lunch">Lunch</SelectItem>
              <SelectItem value="Dinner">Dinner</SelectItem>
              <SelectItem value="Snack">Snack</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Meal Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Chicken Salad"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="time">Date & Time</Label>
          <Input
            id="time"
            name="time"
            type="datetime-local"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional notes about this meal"
            rows={1}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="e.g., 1 bowl or 1 wrap"
              required
            />
          </div>

          <div className="flex items-end">
            <Button type="button" onClick={generateMacros} className="w-full">
              Generate Macros
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {formData.items.map((item, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-md">
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                <div className="space-y-2">
                  <Label>Calories</Label>
                  <Input
                    type="number"
                    value={item.calories}
                    onChange={(e) =>
                      handleItemChange(index, "calories", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Protein (g)</Label>
                  <Input
                    type="number"
                    value={item.protein}
                    onChange={(e) =>
                      handleItemChange(index, "protein", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Carbs (g)</Label>
                  <Input
                    type="number"
                    value={item.carbs}
                    onChange={(e) =>
                      handleItemChange(index, "carbs", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fat (g)</Label>
                  <Input
                    type="number"
                    value={item.fat}
                    onChange={(e) =>
                      handleItemChange(index, "fat", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Meal</Button>
      </div>
    </form>
  );
}
