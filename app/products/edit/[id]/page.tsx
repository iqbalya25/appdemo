// app/products/edit/[id]/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import { useEffect, useState } from "react";

import { Loader2 } from "lucide-react";
import { Product } from "@/types/Product";
import { useToast } from "@/hooks/use-toast";
import { productApi } from "@/lib/api";
import { ProductForm } from "@/components/product/ProductForm";


export default function EditProductPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productApi.getById(parseInt(params.id));
        setProduct(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load product",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

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