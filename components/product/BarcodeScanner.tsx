// components/product/BarcodeScanner.tsx
import React, { useState } from 'react';
import { useZxing } from 'react-zxing';
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogTitle } from '@radix-ui/react-alert-dialog';
import { AlertDialogHeader } from '../ui/alert-dialog';
import { useToast } from "@/hooks/use-toast";

interface BarcodeScannerProps {
  onScan: (barcode: string) => Promise<void>;
}

export function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const { ref } = useZxing({
    onDecodeResult: async (result) => {
      try {
        setIsScanning(true);
        await onScan(result.getText());
        setIsOpen(false);
        toast({
          title: "Success",
          description: "Barcode scanned successfully",
        });
      } catch (error) {
        console.error('Scan error:', error);
        toast({
          title: "Error",
          description: "Failed to process barcode",
          variant: "destructive",
        });
      } finally {
        setIsScanning(false);
      }
    },
    constraints: {
        video: {
          facingMode: { exact: "environment" }, // This is the correct way to specify rear camera
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 }
        }
      },
  });

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-2"
      >
        <Camera className="h-4 w-4" />
        Scan Product Barcode
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Scan Product Barcode</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="relative">
            <video 
              ref={ref} 
              className="w-full aspect-video object-cover"
              style={{
                transform: 'scaleX(-1)' // Mirror the video for more intuitive scanning
              }} 
            />
            {isScanning && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <p className="text-white">Processing...</p>
              </div>
            )}
            <div className="absolute inset-0 border-2 border-primary/50 rounded-lg pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-1/3 border-2 border-primary"></div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}