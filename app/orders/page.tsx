"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { orderApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Order, OrderFilter } from "@/types/order";
import { OrderFilters } from "@/components/orders/OrderFilters";
import { OrderTable } from "@/components/orders/Ordertable";

export default function OrdersPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderFilter>({
    status: "all",
    search: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") {
      redirect("/login");
    }
  }, [session]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        console.log("Session token:", session?.user?.accessToken); // Debug token
        const data = await orderApi.getAll();
        console.log("Orders data:", data); // Debug response
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error); // Debug error
        toast({
          title: "Error",
          description: "Failed to load orders",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchOrders();
    }
  }, [session, toast]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(filter.search.toLowerCase()) ||
      order.items.some((item) =>
        item.productName.toLowerCase().includes(filter.search.toLowerCase())
      );

    const matchesStatus =
      filter.status === "all" || order.status === filter.status;

    return matchesSearch && matchesStatus;
  });

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <OrderFilters filter={filter} onFilterChange={setFilter} />
        </CardHeader>
        <CardContent>
          <OrderTable orders={filteredOrders} />
        </CardContent>
      </Card>
    </div>
  );
}
