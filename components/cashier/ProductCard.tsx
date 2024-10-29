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
      className="cursor-pointer hover:bg-accent transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="aspect-square relative mb-2">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="rounded-md object-cover"
            />
          ) : (
            <div className="w-full h-full bg-secondary rounded-md flex items-center justify-center">
              No image
            </div>
          )}
        </div>
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-sm text-muted-foreground">
          Rp. {product.price.toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}