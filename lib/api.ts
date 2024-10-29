// lib/api.ts
import { Product } from "@/types/Product";
import api from "./axios";
import { Category } from "@/types/Category";
import { Order } from "@/types/order";

type CreateProductData = Omit<Product, "id">;

interface CreateOrderRequest {
  items: {
    productId: number;
    quantity: number;
  }[];
}

interface OrderResponse {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  // Add other order response fields as needed
}

interface ProductApiInterface {
  getAll: () => Promise<Product[]>;
  getById: (id: number) => Promise<Product>;
  getByBarcode: (barcode: string) => Promise<Product>;
  create: (data: CreateProductData) => Promise<Product>;
  update: (id: number, data: Partial<Product>) => Promise<Product>;
  delete: (id: number) => Promise<void>;
  createOrder: (data: CreateOrderRequest) => Promise<OrderResponse>;
}

interface CategoryApiInterface {
  getAll: () => Promise<Category[]>;
}

export const productApi: ProductApiInterface = {
  getAll: () => api.get<Product[]>("/products").then((res) => res.data),

  getById: (id: number) =>
    api.get<Product>(`/products/${id}`).then((res) => res.data),

  getByBarcode: (barcode: string) =>
    api.get<Product>(`/products/barcode/${barcode}`).then((res) => res.data),

  create: (data: CreateProductData) =>
    api.post<Product>("/products", data).then((res) => res.data),

  update: (id: number, data: Partial<Product>) =>
    api.put<Product>(`/products/${id}`, data).then((res) => res.data),

  delete: (id: number) => 
    api.delete(`/products/${id}`).then(() => undefined),

  createOrder: (data: CreateOrderRequest) =>
    api.post<OrderResponse>("/orders", data).then((res) => res.data),
};

export const categoryApi: CategoryApiInterface = {
  getAll: () => api.get<Category[]>("/categories").then((res) => res.data),
};

export const orderApi = {
  getAll: () => api.get<Order[]>("/orders").then((res) => res.data),
};