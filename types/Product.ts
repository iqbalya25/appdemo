// types/Product.ts
import { Category } from "./Category";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  barcode: string;
  imageUrl: string | null;
  isActive: boolean;
  category?: Category;  // Make sure category is included
  createdAt?: string;
  updatedAt?: string;
}