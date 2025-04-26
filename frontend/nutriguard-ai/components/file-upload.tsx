"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, File, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadLabelForOCR, getOcrIngredientSummary } from "@/services/api";
import { TrendingUp, Award, List, Bot } from "lucide-react";

interface FileUploadProps {
  isImageOnly?: boolean;
  onUpload?: (file: File) => Promise<void>;
}

export default function FileUpload({
  isImageOnly = false,
  onUpload,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [summary, setSummary] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (selectedFile: File) => {
    if (isImageOnly && !selectedFile.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    setFile(selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }

    // External upload logic (parent handles everything)
    if (onUpload) {
      await onUpload(selectedFile);
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await uploadLabelForOCR(formData);

      const { extracted_text, ingredients } = response.data as {
        extracted_text: string;
        ingredients: string[];
      };

      setIngredients(ingredients || []);

      const summaryResp = await getOcrIngredientSummary(ingredients);
      const { summary } = summaryResp.data as { summary: string };
      setSummary(summary);
    } catch (err) {
      console.error("OCR upload failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setIngredients([]);
    setSummary(null);
  };

  return (
    <div>
      {!file ? (
        <Card
          className={`border-2 border-dashed ${
            isDragging ? "border-primary" : "border-muted-foreground/25"
          } hover:border-primary/50 transition-colors cursor-pointer`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            {isImageOnly ? (
              <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
            ) : (
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            )}
            <p className="text-sm font-medium mb-1">
              {isImageOnly ? "Upload food label image" : "Upload file"}
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Drag and drop or click to browse
            </p>
            <Button variant="outline" size="sm" type="button">
              Select {isImageOnly ? "Image" : "File"}
            </Button>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept={isImageOnly ? "image/*" : undefined}
              onChange={handleFileChange}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10"
            onClick={(e) => {
              e.stopPropagation();
              removeFile();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardContent className="p-4">
            {preview ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-md mb-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="flex items-center p-2">
                <File className="h-8 w-8 mr-2 text-muted-foreground" />
                <div className="text-sm truncate">{file.name}</div>
              </div>
            )}

            {isLoading && (
              <p className="text-sm text-muted-foreground">Analyzing...</p>
            )}

            {ingredients.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-sm mb-2">
                  Ingredients Detected:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground border"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {summary && (
              <Card className="mt-6">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-xl font-bold text-primary">
                    AI Nutrition Insights
                  </CardTitle>
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <Bot className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="text-foreground text-base leading-relaxed space-y-6">
                  {summary.split("\n").map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
