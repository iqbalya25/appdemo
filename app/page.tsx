import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to dashboard or login
  redirect("/login");
}

// Add metadata
export const metadata = {
  title: 'Smart Warehouse',
  description: 'Smart Warehouse Management System',
};
