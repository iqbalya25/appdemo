// app/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { Package, LogOut, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { UserInfo } from "@/components/dashboard/UserInfo";
import { useProducts } from "@/hooks/useProduct";
import { ProductsTable } from "@/components/dashboard/ProductTable";


export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const { products, loading, deleteProduct } = useProducts();

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }

  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button variant="outline" onClick={() => signOut({ callbackUrl: "/login" })}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <UserInfo user={session.user} />

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Products Management
              </CardTitle>
              {isAdmin && (
                <Link href="/products/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ProductsTable
              products={products}
              isAdmin={isAdmin}
              onDelete={deleteProduct}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}