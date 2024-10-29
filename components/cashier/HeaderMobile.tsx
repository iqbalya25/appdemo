import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { CartItem } from "@/types/CartItem";
import { Menu, ShoppingCart } from "lucide-react";

interface HeaderMobileProps {
  isMobileCategoriesOpen: boolean;
  setIsMobileCategoriesOpen: (open: boolean) => void;
  isMobileCartOpen: boolean;
  setIsMobileCartOpen: (open: boolean) => void;
  cart: CartItem[];
}

export function HeaderMobile({
  isMobileCategoriesOpen,
  setIsMobileCategoriesOpen,
  isMobileCartOpen,
  setIsMobileCartOpen,
  cart,
}: HeaderMobileProps) {
  return (
    <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
      <Sheet
        open={isMobileCategoriesOpen}
        onOpenChange={setIsMobileCategoriesOpen}
      >
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
      </Sheet>

      <h1 className="text-lg font-semibold">Cashier</h1>

      <div className="flex items-center gap-2">
        <Sheet open={isMobileCartOpen} onOpenChange={setIsMobileCartOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Button>
          </SheetTrigger>
        </Sheet>
      </div>
    </div>
  );
}
