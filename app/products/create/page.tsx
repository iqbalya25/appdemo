// app/products/create/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ProductForm } from "@/components/product/ProductForm";

export default function CreateProductPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const searchParams = useSearchParams();
  const barcode = searchParams.get('barcode');

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto py-8">
      <ProductForm initialBarcode={barcode} />
    </div>
  );
}