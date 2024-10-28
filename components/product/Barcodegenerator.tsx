// components/product/BarcodeGenerator.tsx
import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface BarcodeGeneratorProps {
  value: string;
}

export function BarcodeGenerator({ value }: BarcodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      try {
        JsBarcode(canvasRef.current, value, {
          format: "CODE128",
          width: 3, // Increased width for better scanning
          height: 150, // Increased height for better scanning
          displayValue: true,
          fontSize: 20,
          margin: 20, // Increased margin for better scanning
          background: "#ffffff",
          lineColor: "#000000",
          textMargin: 8,
          font: "monospace",
          textAlign: "center",
          // Added quiet zone (white space) around barcode
          marginTop: 40,
          marginBottom: 40,
          marginLeft: 40,
          marginRight: 40,
        });
      } catch (error) {
        console.error("Error generating barcode:", error);
      }
    }
  }, [value]);

  return (
    <div className="space-y-4 bg-white p-8 rounded-lg">
      <div className="flex justify-center">
        <canvas ref={canvasRef} />
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm font-mono">
          Barcode: {value}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (canvasRef.current) {
              const link = document.createElement('a');
              link.download = `barcode-${value}.png`;
              link.href = canvasRef.current.toDataURL('image/png');
              link.click();
            }
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );
}