import { Badge } from "@/components/ui/badge";
import { PaymentStatus } from "@/types/order";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "PAID":
        return "bg-green-500";
      case "UNPAID":
        return "bg-red-500";
      case "REFUNDED":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Badge className={`${getPaymentStatusColor(status)} text-white`}>
      {status}
    </Badge>
  );
}
