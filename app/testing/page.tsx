// app/test/barcode/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { BarcodeScanner } from "@/components/product/BarcodeScanner";
import { productApi } from "@/lib/api";
import { Loader2, AlertCircle } from "lucide-react";
import { BarcodeGenerator } from "@/components/product/Barcodegenerator";
import { AxiosError } from "axios";

export default function BarcodeTestPage() {
  const [testBarcode, setTestBarcode] = useState("");
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateNewTestBarcode = () => {
    // Generate a random 12-digit number
    const randomNum = Math.floor(Math.random() * 1000000000000)
      .toString()
      .padStart(12, "0");
    setTestBarcode(randomNum);
  };

  const handleScan = async (barcode: string) => {
    try {
      setLoading(true);
      setScannedBarcode(barcode);

      // Try to find existing product
      const response = await productApi.getByBarcode(barcode);

      toast({
        title: "Product Found",
        description: `Found existing product: ${response.name}`,
      });
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        toast({
          title: "New Product",
          description: "Barcode available for new product registration",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to process barcode",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Barcode Testing Page</h1>
          <p className="text-muted-foreground">
            Generate and scan barcodes to test product lookup functionality
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Testing Instructions</AlertTitle>
          <AlertDescription>
            1. Generate a test barcode below
            <br />
            2. Use your phone to scan the displayed barcode
            <br />
            3. System will check if the product exists
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Generator Section */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Test Barcode</CardTitle>
              <CardDescription>
                Create a barcode to test the scanning functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={generateNewTestBarcode} className="w-full">
                Generate New Barcode
              </Button>
              {testBarcode && <BarcodeGenerator value={testBarcode} />}
            </CardContent>
          </Card>

          {/* Scanner Section */}
          <Card>
            <CardHeader>
              <CardTitle>Scan Barcode</CardTitle>
              <CardDescription>
                Use your device&apos;s camera to scan the barcode
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <BarcodeScanner onScan={handleScan} />

              {loading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}

              {scannedBarcode && !loading && (
                <Alert>
                  <AlertTitle>Last Scanned Barcode</AlertTitle>
                  <AlertDescription>{scannedBarcode}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}