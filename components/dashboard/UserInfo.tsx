// components/dashboard/UserInfo.tsx
import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Session } from "next-auth";

interface UserInfoProps {
  user: Session["user"];
}

export function UserInfo({ user }: UserInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">
              Role: {user.role}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}