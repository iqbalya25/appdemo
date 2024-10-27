import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ImagePreviewProps {
  url: string;
  onRemove: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ url, onRemove }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="relative w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-sm text-gray-500">Failed to load image</p>
        <Button
          variant="destructive"
          size="sm"
          className="absolute top-2 right-2"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-48 group">
      <Image
        src={url}
        alt="Preview"
        fill
        className="rounded-lg object-cover"
        onError={() => setError(true)}
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
        <Button
          variant="destructive"
          size="sm"
          className="absolute top-2 right-2"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};