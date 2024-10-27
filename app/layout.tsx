// app/layout.tsx
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
import { Providers } from "./session-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mini E-commerce",
  description: "A mini e-commerce application"
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}