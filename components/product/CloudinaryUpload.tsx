import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface CloudinaryUploadProps {
  onChange: (url: string) => void;
}

const CLOUDINARY_UPLOAD_PRESET = "finproHII";
const CLOUDINARY_CLOUD_NAME = "djyevwtie";

export function CloudinaryUpload({ onChange }: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      if (response.data.secure_url) {
        onChange(response.data.secure_url);
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed rounded-lg p-8 transition-colors hover:border-primary cursor-pointer">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
        id="imageUpload"
        disabled={uploading}
      />
      <label htmlFor="imageUpload" className="cursor-pointer">
        <div className="flex flex-col items-center justify-center gap-2">
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-600">Click to upload image</p>
              <p className="text-xs text-gray-500">JPG, PNG, WebP up to 5MB</p>
            </>
          )}
        </div>
      </label>
    </div>
  );
}