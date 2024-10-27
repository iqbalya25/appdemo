"use client";

import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/useProduct";
import { ProductsTable } from "@/components/dashboard/ProductTable";

export default function ProductsPage() {
  const { data: session } = useSession();
  const { products, loading, deleteProduct } = useProducts();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="container mx-auto py-8">
      <ProductsTable
        products={products}
        isAdmin={isAdmin}
        onDelete={deleteProduct}
      />
    </div>
  );
}
