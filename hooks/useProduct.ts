import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { Product } from "@/types/Product";
import { useToast } from "./use-toast";
import { productApi } from "@/lib/api";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const { toast } = useToast();

  const fetchProducts = async () => {
    if (!session?.user?.accessToken) return;

    try {
      setLoading(true);
      const data = await productApi.getAll();
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
      await productApi.delete(id);
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
      throw error; // Rethrow to handle in the component
    }
  };

  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchProducts();
    }
  }, [session?.user?.accessToken]);

  return { products, loading, deleteProduct, fetchProducts };
}