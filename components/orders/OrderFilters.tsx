import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderFilter } from "@/types/order";

interface OrderFiltersProps {
  filter: OrderFilter;
  onFilterChange: (filter: OrderFilter) => void;
}

export function OrderFilters({ filter, onFilterChange }: OrderFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search orders..."
          className="pl-8"
          value={filter.search}
          onChange={(e) =>
            onFilterChange({ ...filter, search: e.target.value })
          }
        />
      </div>
      <Select
        value={filter.status}
        onValueChange={(value) =>
          onFilterChange({ ...filter, status: value })
        }
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="CANCELLED">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
