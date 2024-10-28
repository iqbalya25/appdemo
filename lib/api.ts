import { Product } from "@/types/Product";
import api from "./axios";
import { Category } from "@/types/Category";

type CreateProductData = Omit<Product, "id">;

export const productApi = {
  getAll: () => api.get<Product[]>("/products").then((res) => res.data),

  getById: (id: number) =>
    api.get<Product>(`/products/${id}`).then((res) => res.data),

  getByBarcode: (barcode: string) =>
    api.get<Product>(`/products/barcode/${barcode}`).then((res) => res.data),

  create: (data: CreateProductData) =>
    api.post<Product>("/products", data).then((res) => res.data),

  update: (id: number, data: Partial<Product>) =>
    api.put<Product>(`/products/${id}`, data).then((res) => res.data),

  delete: (id: number) => api.delete(`/products/${id}`).then((res) => res.data),
};

export const categoryApi = {
  getAll: () => api.get<Category[]>("/categories").then((res) => res.data),
};
