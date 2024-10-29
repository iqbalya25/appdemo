import { Product } from "@/types/Product";
import { TableCell, TableRow } from "../ui/table";
import { ProductImage } from "./ProductImage";
import Link from "next/link";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import { DeleteProductDialog } from "./DeleteProductDialog";

interface ProductRowProps {
  product: Product;
  isAdmin: boolean;
  onDelete: (id: number) => Promise<void>;
}

export const ProductRow: React.FC<ProductRowProps> = ({
  product,
  isAdmin,
  onDelete,
}) => {
  return (
    <TableRow>
      <TableCell>
        <ProductImage src={product.imageUrl} alt={product.name} />
      </TableCell>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell>{product.category?.name || "N/A"}</TableCell>
      <TableCell>Rp. {product.price.toLocaleString("id-ID")}</TableCell>
      {isAdmin && (
        <TableCell className="text-right space-x-2">
          <Link href={`/products/edit/${product.id}`}>
            <Button variant="outline" size="sm">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <DeleteProductDialog
            productId={product.id}
            productName={product.name}
            onDelete={onDelete}
          />
        </TableCell>
      )}
    </TableRow>
  );
};
