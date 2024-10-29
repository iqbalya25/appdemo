import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order, OrderItem } from "@/types/order";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({ orders }: OrderTableProps) {
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>(
    {}
  );

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const formatItems = (items: OrderItem[], orderId: string) => {
    if (!items || items.length === 0) {
      return <span className="text-muted-foreground italic">No items</span>;
    }

    const isExpanded = expandedOrders[orderId];
    const displayedItems = isExpanded ? items : items.slice(0, 2);
    const hasMoreItems = items.length > 2;

    return (
      <div className="space-y-1">
        {displayedItems.map((item, index) => (
          <div
            key={`${orderId}-${item.productId}-${index}`}
            className="text-sm"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="truncate max-w-[300px] block">
                    {item.productName}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.productName}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}

        {hasMoreItems && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-1 h-6 text-xs"
            onClick={() => toggleOrderExpansion(orderId)}
          >
            {isExpanded ? (
              <div className="flex items-center">
                Show Less <ChevronUp className="h-4 w-4 ml-1" />
              </div>
            ) : (
              <div className="flex items-center">
                {items.length - 2} more items{" "}
                <ChevronDown className="h-4 w-4 ml-1" />
              </div>
            )}
          </Button>
        )}
      </div>
    );
  };

  const formatQuantities = (items: OrderItem[], orderId: string) => {
    if (!items || items.length === 0) {
      return <span className="text-muted-foreground italic">-</span>;
    }

    const isExpanded = expandedOrders[orderId];
    const displayedItems = isExpanded ? items : items.slice(0, 2);

    return (
      <div className="space-y-1">
        {displayedItems.map((item, index) => (
          <div
            key={`${orderId}-quantity-${item.productId}-${index}`}
            className="text-sm text-center"
          >
            {item.quantity}
          </div>
        ))}
        {!isExpanded && items.length > 2 && (
          <div className="h-6" /> // Spacer for the "show more" button
        )}
      </div>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="min-w-[250px]">Items</TableHead>
            <TableHead className="text-center">Qty</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow
                key={order.orderNumber}
                className={cn(
                  expandedOrders[order.orderNumber] && "bg-muted/50"
                )}
              >
                <TableCell className="font-medium">
                  {order.orderNumber}
                </TableCell>
                <TableCell>
                  {order.createdAt
                    ? format(new Date(order.createdAt), "dd MMM yyyy HH:mm")
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {formatItems(order.items, order.orderNumber)}
                </TableCell>
                <TableCell>
                  {formatQuantities(order.items, order.orderNumber)}
                </TableCell>
                <TableCell>Rp. {order.finalAmount.toLocaleString()}</TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell>
                  <PaymentStatusBadge status={order.paymentStatus} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
