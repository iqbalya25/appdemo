import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartItem } from "@/types/CartItem";
import {
  Minus,
  Plus,
  Trash2,
  CreditCard,
  Loader2,
  Barcode,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface CartContentProps {
  cart: CartItem[];
  total: number;
  onUpdateQuantity: (productId: number, delta: number) => void;
  onPayment: () => Promise<void>;
  processingPayment: boolean;
  onBarcodeSubmit: (barcode: string) => Promise<void>;
}

export function CartContent({
  cart,
  total,
  onUpdateQuantity,
  onPayment,
  processingPayment,
  onBarcodeSubmit,
}: CartContentProps) {
  const [barcode, setBarcode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const lastKeystrokeTime = useRef<number>(0);
  const barcodeTimeout = useRef<NodeJS.Timeout>();

  // Handle barcode input
  const handleBarcodeChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = e.target.value;
    setBarcode(newValue);

    const currentTime = Date.now();
    lastKeystrokeTime.current = currentTime;

    // Clear any existing timeout
    if (barcodeTimeout.current) {
      clearTimeout(barcodeTimeout.current);
    }

    // Set a new timeout
    barcodeTimeout.current = setTimeout(async () => {
      // Only process if the barcode has a reasonable length and no keystroke
      // has been received in the last 50ms
      if (
        newValue.length >= 5 &&
        currentTime === lastKeystrokeTime.current &&
        !isProcessing
      ) {
        try {
          setIsProcessing(true);
          await onBarcodeSubmit(newValue);
          setBarcode(""); // Clear input after successful submission
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          // Error handling is done in the parent component
        } finally {
          setIsProcessing(false);
        }
      }
    }, 50); // 50ms delay to distinguish between manual typing and scanner
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (barcodeTimeout.current) {
        clearTimeout(barcodeTimeout.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="relative mb-4">
        <Input
          value={barcode}
          onChange={handleBarcodeChange}
          placeholder="Scan barcode..."
          className="pr-10"
          disabled={isProcessing}
          autoFocus
        />
        <Barcode className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between"
            >
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Rp. {item.price.toLocaleString()} x {item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onUpdateQuantity(item.productId, -1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onUpdateQuantity(item.productId, 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-500"
                  onClick={() =>
                    onUpdateQuantity(item.productId, -item.quantity)
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 space-y-4 border-t mt-4">
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>Rp. {total.toLocaleString()}</span>
        </div>
        <Button
          className="w-full h-12"
          onClick={onPayment}
          disabled={processingPayment || cart.length === 0}
        >
          {processingPayment ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" />
              Pay Now
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
