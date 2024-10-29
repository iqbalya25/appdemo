import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Providers } from "./session-provider";
import MainNav from "@/components/navigation/MainNav";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "Smart Warehouse",
    template: "%s | Smart Warehouse",
  },
  description: "Smart Warehouse Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <MainNav />
          <main className="pt-16">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}