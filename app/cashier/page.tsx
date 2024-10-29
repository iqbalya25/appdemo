// app/cashier/page.tsx (continued)
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Loader2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/Product";
import { Category } from "@/types/Category";
import { productApi, categoryApi } from "@/lib/api";
import { CartContent } from "@/components/cashier/CartContent";
import { CategoryList } from "@/components/cashier/CategoryList";
import { ProductCard } from "@/components/cashier/ProductCard";
import { HeaderMobile } from "@/components/cashier/HeaderMobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import debounce from "lodash/debounce";
import { CartItem } from "@/types/CartItem";
import useIsMobile from "@/hooks/useIsMobile";

export default function CashierPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  // Initialize data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          productApi.getAll(),
          categoryApi.getAll(),
        ]);

        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(categoriesData);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load initial data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchData();
    }
  }, [session, toast]);

  // Filter products based on search and category
  useEffect(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.categoryId === selectedCategory
      );
    }

    if (searchQuery) {
      const lowercaseSearch = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(lowercaseSearch) ||
          product.description?.toLowerCase().includes(lowercaseSearch) ||
          product.barcode?.toLowerCase().includes(lowercaseSearch)
      );
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, 300);

  const handleAddToCart = (product: Product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.productId === product.id
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.price,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          subtotal: product.price,
        },
      ];
    });

    if (isMobile) {
      setIsMobileCartOpen(true);
    }

    toast({
      title: "Added to cart",
      description: `${product.name} added to cart`,
    });
  };

  const handleUpdateQuantity = (productId: number, delta: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (item.productId === productId) {
            const newQuantity = Math.max(0, item.quantity + delta);
            return {
              ...item,
              quantity: newQuantity,
              subtotal: newQuantity * item.price,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handlePayment = async () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to cart before payment",
        variant: "destructive",
      });
      return;
    }

    setProcessingPayment(true);
    try {
      await productApi.createOrder({
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      toast({
        title: "Success",
        description: "Payment processed successfully",
      });

      setCart([]);
      setIsMobileCartOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleBarcodeSubmit = async (barcode: string) => {
    try {
      const product = await productApi.getByBarcode(barcode);
      handleAddToCart(product);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive",
      });
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <HeaderMobile
        isMobileCategoriesOpen={isMobileCategoriesOpen}
        setIsMobileCategoriesOpen={setIsMobileCategoriesOpen}
        isMobileCartOpen={isMobileCartOpen}
        setIsMobileCartOpen={setIsMobileCartOpen}
        cart={cart}
      />

      {/* Mobile Categories Menu */}
      <Sheet
        open={isMobileCategoriesOpen}
        onOpenChange={setIsMobileCategoriesOpen}
      >
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <div className="py-4">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <div className="space-y-2">
              <Button
                variant={selectedCategory === null ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setSelectedCategory(null);
                  setIsMobileCategoriesOpen(false);
                }}
              >
                All Products
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "ghost"
                  }
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setIsMobileCategoriesOpen(false);
                  }}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Categories */}
      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Products Section */}
      <div className="flex-1 p-4">
        <Card className="h-[calc(100vh-2rem)]">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Products</span>
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-8"
                onChange={handleSearch}
              />
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => handleAddToCart(product)}
                  />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Cart */}
      <Sheet open={isMobileCartOpen} onOpenChange={setIsMobileCartOpen}>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <div className="py-4 h-full">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <CartContent
              cart={cart}
              total={total}
              onUpdateQuantity={handleUpdateQuantity}
              onPayment={handlePayment}
              processingPayment={processingPayment}
              onBarcodeSubmit={handleBarcodeSubmit}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Cart */}
      <Card className="hidden md:block w-96 flex-shrink-0 m-4 h-[calc(100vh-2rem)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-20rem)]">
            <CartContent
              cart={cart}
              total={total}
              onUpdateQuantity={handleUpdateQuantity}
              onPayment={handlePayment}
              processingPayment={processingPayment}
              onBarcodeSubmit={handleBarcodeSubmit}
            />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
