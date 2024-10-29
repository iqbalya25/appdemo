import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Product } from "@/types/Product";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <Card
      className="cursor-pointer hover:bg-accent transition-colors overflow-hidden group"
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        <div className="aspect-square relative mb-2">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="rounded-md object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-secondary rounded-md flex items-center justify-center">
              No image
            </div>
          )}
        </div>
        <div className="space-y-2">
          <h3 className="font-medium line-clamp-1" title={product.name}>
            {product.name}
          </h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="font-mono">{product.barcode}</p>
            <p className="font-semibold text-primary">
              Rp. {product.price.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
