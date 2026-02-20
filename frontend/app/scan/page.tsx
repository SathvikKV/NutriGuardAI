"use client";

import { useState } from "react";
import BarcodeScanner from "@/components/BarcodeScanner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ScanPage() {
    const router = useRouter();
    const [scannedCode, setScannedCode] = useState<string | null>(null);
    const [productData, setProductData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleScan = async (code: string) => {
        setScannedCode(code);
        setLoading(true);
        try {
            // 1. Fetch from OpenFoodFacts (Client-side directly or via backend proxy)
            // Direct call is faster for demo, backend proxy is cleaner.
            // Let's call OpenFoodFacts API directly to save backend setup time for now.
            const response = await axios.get(
                `https://world.openfoodfacts.org/api/v0/product/${code}.json`
            );

            if (response.data.status === 1) {
                setProductData(response.data.product);
            } else {
                alert("Product not found in OpenFoodFacts database.");
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            alert("Failed to fetch product data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h1 className="text-2xl font-bold mb-4 text-center">Scan Barcode</h1>

            {!scannedCode ? (
                <BarcodeScanner onScanSuccess={handleScan} />
            ) : (
                <div className="space-y-4">
                    <div className="bg-green-100 p-4 rounded text-center">
                        <p className="font-mono text-lg">{scannedCode}</p>
                        <p className="text-sm text-green-700">Scanned Successfully!</p>
                    </div>

                    {loading && <p className="text-center">Loading product info...</p>}

                    {productData && (
                        <div className="border p-4 rounded shadow bg-white">
                            <h2 className="text-xl font-bold">{productData.product_name}</h2>
                            <img
                                src={productData.image_front_small_url}
                                alt={productData.product_name}
                                className="my-2 h-32 object-contain mx-auto"
                            />
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <p>Calories: {productData.nutriments["energy-kcal_100g"]} kcal/100g</p>
                                <p>Protein: {productData.nutriments.proteins_100g}g</p>
                                <p>Carbs: {productData.nutriments.carbohydrates_100g}g</p>
                                <p>Fat: {productData.nutriments.fat_100g}g</p>
                            </div>
                            <Button
                                className="w-full mt-4"
                                onClick={() => alert("Add to backend implementation coming soon!")}
                            >
                                Log This Meal
                            </Button>
                        </div>
                    )}

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            setScannedCode(null);
                            setProductData(null);
                        }}
                    >
                        Scan Again
                    </Button>
                </div>
            )}
        </div>
    );
}
