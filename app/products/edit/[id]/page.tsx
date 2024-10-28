// app/products/edit/[id]/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { redirect, useParams } from "next/navigation";

import { useEffect, useState } from "react";

import { Loader2 } from "lucide-react";
import { Product } from "@/types/Product";
import { useToast } from "@/hooks/use-toast";
import { productApi } from "@/lib/api";
import { ProductForm } from "@/components/product/ProductForm";


export default function EditProductPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const params = useParams()
  const id = params.id as string

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productApi.getById(parseInt(id));
        setProduct(data);
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load product",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);


  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Product not found
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <ProductForm initialData={product} />
    </div>
  );
}