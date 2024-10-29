import { Button } from "@/components/ui/button";
import { CartItem } from "@/types/CartItem";
import { Minus, Plus, Trash2, CreditCard, Loader2 } from "lucide-react";


interface CartContentProps {
  cart: CartItem[];
  total: number;
  onUpdateQuantity: (productId: number, delta: number) => void;
  onPayment: () => Promise<void>;
  processingPayment: boolean;
}

export function CartContent({
  cart,
  total,
  onUpdateQuantity,
  onPayment,
  processingPayment,
}: CartContentProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.productId} className="flex items-center justify-between">
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
                  onClick={() => onUpdateQuantity(item.productId, -item.quantity)}
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

