import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types/order";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500";
      case "PENDING":
        return "bg-yellow-500";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Badge className={`${getStatusColor(status)} text-white`}>
      {status}
    </Badge>
  );
}