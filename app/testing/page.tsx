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
import { Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios"; // Add this import
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";

export default function BarcodeTestPage() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [testBarcode, setTestBarcode] = useState("");
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const generateNewTestBarcode = () => {
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
      setShowDialog(false);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        toast({
          title: "New Product",
          description: "Barcode available for new product registration",
        });
        setShowDialog(true);
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

  const handleAddProduct = () => {
    if (scannedBarcode) {
      router.push(`/products/create?barcode=${scannedBarcode}`);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Scan Product Barcode</h1>
          <p className="text-muted-foreground">
            Scan a barcode to find or add a product
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Instructions</AlertTitle>
          <AlertDescription>
            1. Use your phone camera to scan a product barcode
            <br />
            2. If product exists, details will be shown
            <br />
            3. If product is new, you can add it to the system
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Product Scanner</CardTitle>
            <CardDescription>
              Position the barcode in front of your camera
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
                <AlertTitle>Scanned Barcode</AlertTitle>
                <AlertDescription>{scannedBarcode}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Product</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <p>Would you like to add a new product with barcode:</p>
            <code className="block p-2 bg-slate-100 rounded">
              {scannedBarcode}
            </code>
            <Button onClick={handleAddProduct} className="w-full">
              Add Product <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
