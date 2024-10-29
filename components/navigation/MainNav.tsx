"use client";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingCart,
  LogOut,
  Menu,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function MainNav() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const isAdmin = session?.user?.role === "ADMIN";
  const isCashier = session?.user?.role === "CASHIER";

  const NavLinks = () => (
    <>
      {isAdmin && (
        <>
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start md:w-auto">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/orders">
            <Button variant="ghost" className="w-full justify-start md:w-auto">
              <ClipboardList className="h-4 w-4 mr-2" />
              Orders
            </Button>
          </Link>
          <Link href="/cashier">
            <Button variant="ghost" className="w-full justify-start md:w-auto">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cashier
            </Button>
          </Link>
        </>
      )}
      {isCashier && (
        <Link href="/cashier">
          <Button variant="ghost" className="w-full justify-start md:w-auto">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Cashier
          </Button>
        </Link>
      )}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold">Cashier App</span>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <NavLinks />
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <NavLinks />
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
