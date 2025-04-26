import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Search, Upload } from "lucide-react";
import IngredientResults from "@/components/ingredient-results";
import FileUpload from "@/components/file-upload";

export default function UploadPage() {
  return (
    <div className="bg-accent/30 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary">Label OCR Upload</h1>
          <p className="text-muted-foreground">
            Upload a food label image to extract and analyze ingredients
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Upload Food Label</h2>
              <FileUpload isImageOnly />
              <Button className="w-full sm:w-auto mt-4">
                <Upload className="mr-2 h-4 w-4" />
                Extract Text
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Supported formats: JPG, PNG, JPEG. Max file size: 5MB
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Extracted Ingredients
              </h2>
              <Textarea
                placeholder="Extracted ingredients will appear here..."
                className="min-h-[150px] mb-4"
                value="Water, Sugar, Natural Flavors, Citric Acid, Sodium Citrate, Potassium Benzoate (Preservative), Sucralose, Acesulfame Potassium, Red 40."
                readOnly
              />
              <Button className="w-full sm:w-auto">
                <Search className="mr-2 h-4 w-4" />
                Analyze Ingredients
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mt-6">
          <IngredientResults analysis={[]} summary="" />
        </div>
      </div>
    </div>
  );
}
