import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function ErrorLoading() {
  return (
    <div className="container mx-auto max-w-md mt-20 p-4">
      <Alert>
        <AlertTitle className="flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading
        </AlertTitle>
        <AlertDescription>
          Please wait while we process your request...
        </AlertDescription>
      </Alert>
    </div>
  );
}
