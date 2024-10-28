// hooks/useProducts.ts
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { Product } from "@/types/Product";
import { useToast } from "./use-toast";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const { toast } = useToast();

  const fetchProducts = async () => {
    if (!session?.user?.accessToken) return;

    try {
      setLoading(true);
      const response = await fetch(
        "https://appdemo-343470541894.asia-southeast2.run.app/api/products",
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!session?.user?.accessToken) return;

    try {
      const response = await fetch(`http://localhost:8080/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to delete product");

      setProducts(products.filter((product) => product.id !== id));
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchProducts();
    }
  }, [session?.user?.accessToken]);

  return { products, loading, deleteProduct };
}
