import Image from "next/image";
import { useState } from "react";

interface ProductImageProps {
  src: string | null;
  alt: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({ src, alt }) => {
  const [error, setError] = useState(false);
  const placeholderImage = "/product-placeholder.png"; // Make sure this exists in your public folder
  const imageSrc = !src || error ? placeholderImage : src;

  return (
    <div className="relative h-10 w-10">
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className="rounded-md object-cover"
        onError={() => setError(true)}
        sizes="(max-width: 40px) 100vw, 40px"
      />
    </div>
  );
};
