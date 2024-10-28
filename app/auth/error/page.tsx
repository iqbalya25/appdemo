"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function AuthError() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    // Redirect to login after 3 seconds
    const timeout = setTimeout(() => {
      router.push("/login");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [router]);

  const getErrorMessage = (error: string) => {
    switch (error) {
      case "Configuration":
        return "There was a problem with the server configuration. Please try again later.";
      case "AccessDenied":
        return "You do not have permission to access this resource.";
      case "Verification":
        return "The verification failed. Please try again.";
      default:
        return "An error occurred during authentication. Please try again.";
    }
  };

  return (
    <div className="container mx-auto max-w-md mt-20 p-4">
      <Alert variant="destructive">
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>
          {error ? getErrorMessage(error) : "An unknown error occurred"}
        </AlertDescription>
      </Alert>
      <div className="mt-4 flex justify-center">
        <Button onClick={() => router.push("/login")}>
          Return to Login
        </Button>
      </div>
    </div>
  );
}