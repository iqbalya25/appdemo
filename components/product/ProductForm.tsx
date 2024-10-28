// components/products/ProductForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudinaryUpload } from "./CloudinaryUpload";
import { ImagePreview } from "./ImagePreview";
import { Product } from "@/types/Product";
import { useCategories } from "@/hooks/useCategory";
import { productApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarcodeScanner } from "./BarcodeScanner";
import { BarcodeGenerator } from "./Barcodegenerator";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Price must be a valid number greater than 0"
    ),
  categoryId: z.string().min(1, "Category is required"),
  barcode: z.string().min(1, "Barcode is required"),
  imageUrl: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const { data: session} = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const { categories } = useCategories();
  const [currentBarcode, setCurrentBarcode] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(
    initialData?.imageUrl || null
  );

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price ? initialData.price.toString() : "",
      categoryId: initialData?.categoryId?.toString() || "",
      barcode: initialData?.barcode || "",
      imageUrl: initialData?.imageUrl || "",
      isActive: initialData?.isActive ?? true,
    },
  });

  const onSubmit = async (values: ProductFormValues) => {
    try {
      // Check for authentication
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to perform this action",
          variant: "destructive",
        });
        router.push("/login");
        return;
      }

      const productData = {
        ...values,
        categoryId: parseInt(values.categoryId),
        price: Number(values.price),
        imageUrl: imageUrl,
      };

      console.log("Submitting product data:", productData);

      if (initialData) {
        await productApi.update(initialData.id, productData);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        await productApi.create(productData);
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Operation failed:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Please log in again to continue",
          variant: "destructive",
        });
        // Optionally redirect to login
        router.push("/login");
      } else {
        toast({
          title: "Error",
          description: initialData
            ? "Failed to update product"
            : "Failed to create product",
          variant: "destructive",
        });
      }
    }
  };

  const handleImageUpload = (url: string) => {
    console.log("Uploaded image URL:", url); // Debug log
    setImageUrl(url);
    form.setValue("imageUrl", url);
  };

  const handleImageRemove = () => {
    setImageUrl(null);
    form.setValue("imageUrl", null);
  };

  const handleBarcodeScan = async (barcode: string) => {
    try {
      // Try to find existing product
      const existingProduct = await productApi.getByBarcode(barcode);
      
      if (existingProduct) {
        toast({
          title: "Product Found",
          description: "This product already exists in the system.",
          variant: "destructive", // Changed from "warning" to "destructive"
        });
        return;
      }
  
      // If no existing product, set the barcode in the form
      form.setValue("barcode", barcode);
      setCurrentBarcode(barcode);
      
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // Product not found - set barcode in form
        form.setValue("barcode", barcode);
        setCurrentBarcode(barcode);
        toast({
          title: "New Product",
          description: "No existing product found. You can add it as new.",
        });
      } else {
        console.error('Error scanning barcode:', error);
        toast({
          title: "Error",
          description: "Failed to process barcode scan",
          variant: "destructive",
        });
      }
    }
  };
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {initialData ? "Edit Product" : "Add New Product"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="scan">Scan Barcode</TabsTrigger>
            </TabsList>

            <TabsContent value="manual">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter product name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter product description"
                            className="resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                            placeholder="0.00"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="barcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Barcode</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter product barcode"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ }) => (
                      <FormItem>
                        <FormLabel>Product Image</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            {imageUrl ? (
                              <ImagePreview
                                url={imageUrl}
                                onRemove={handleImageRemove}
                              />
                            ) : (
                              <CloudinaryUpload onChange={handleImageUpload} />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full"
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {initialData ? "Updating..." : "Creating..."}
                      </>
                    ) : initialData ? (
                      "Update Product"
                    ) : (
                      "Create Product"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="scan">
              <div className="space-y-8">
                <div className="grid gap-4">
                  <BarcodeScanner onScan={handleBarcodeScan} />
                  {currentBarcode && (
                    <BarcodeGenerator value={currentBarcode} />
                  )}
                </div>

                {currentBarcode && (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter product name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Enter product description"
                                className="resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value)}
                                placeholder="0.00"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem
                                    key={category.id}
                                    value={category.id.toString()}
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ }) => (
                          <FormItem>
                            <FormLabel>Product Image</FormLabel>
                            <FormControl>
                              <div className="space-y-4">
                                {imageUrl ? (
                                  <ImagePreview
                                    url={imageUrl}
                                    onRemove={handleImageRemove}
                                  />
                                ) : (
                                  <CloudinaryUpload
                                    onChange={handleImageUpload}
                                  />
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="w-full"
                      >
                        {form.formState.isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create Product"
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
