import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { useState } from "react";
import { Button } from "../ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog";

interface DeleteProductDialogProps {
    productId: number;
    productName: string;
    onDelete: (id: number) => Promise<void>;
  }
  
  export const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({
    productId,
    productName,
    onDelete,
  }) => {
    const [isDeleting, setIsDeleting] = useState(false);
  
    const handleDelete = async () => {
      try {
        setIsDeleting(true);
        await onDelete(productId);
      } finally {
        setIsDeleting(false);
      }
    };
  
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{productName}&quot;? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };