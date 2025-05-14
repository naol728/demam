// components/SellerProducts.jsx

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  getallProducts,
  getProductById,
  updateProduct,
} from "@/services/products";
import { getCatagories } from "@/services/catagorie";
import { formatDate, formatPrice } from "@/lib/formater";

export default function SellerProducts() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editProductId, setEditProductId] = useState(null);
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category_id: "",
    image_url: null,
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getallProducts(),
  });

  const { data: categories, isLoading: loadingCatagories } = useQuery({
    queryFn: () => getCatagories(),
    queryKey: ["catagories"],
  });

  const { data: productDetail } = useQuery({
    queryKey: ["product", editProductId],
    queryFn: () => getProductById(editProductId),
    enabled: !!editProductId,
    onSuccess: (data) => {
      setFormState({
        name: data.name || "",
        description: data.description || "",
        price: data.price || "",
        stock_quantity: data.stock_quantity || "",
        category_id: data.category_id || "",
        image_url: null,
      });
    },
  });

  const { mutate: editProduct, isLoading: isUpdating } = useMutation({
    mutationFn: (payload) => updateProduct(editProductId, payload),
    onSuccess: () => {
      toast({ title: "Product updated successfully" });
      queryClient.invalidateQueries(["products"]);
    },
    onError: (err) => {
      toast({
        title: "Update failed",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const handleUpdate = () => {
    const payload = { ...formState };
    if (payload.image_url instanceof File) {
      // handle image upload logic in your updateProduct function
    }
    editProduct(payload);
  };
  console.log(editProductId);
  return (
    <div className="ml-10">
      <h2 className="text-center font-semibold text-lg mb-4">Your Products</h2>
      <Table className="max-w-5xl mx-auto">
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <Skeleton className="w-full h-[30px] rounded-full" />
          ) : (
            products?.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <img src={p.image_url} className="size-10" alt={p.name} />
                </TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{formatPrice(p.price)}</TableCell>
                <TableCell>{p.description}</TableCell>
                <TableCell>{p.stock_quantity}</TableCell>
                <TableCell>{p.category?.name}</TableCell>
                <TableCell>{formatDate(p.created_at)}</TableCell>
                <TableCell>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        onClick={() => setEditProductId(p.id)}
                        variant="outline"
                      >
                        Edit
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Edit Product</SheetTitle>
                        <SheetDescription>
                          Update your product details below
                        </SheetDescription>
                      </SheetHeader>
                      <div className="grid gap-4 py-4">
                        <Label>Name</Label>
                        <Input
                          value={formState.name}
                          onChange={(e) =>
                            setFormState({ ...formState, name: e.target.value })
                          }
                        />
                        <Label>Description</Label>
                        <Input
                          value={formState.description}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              description: e.target.value,
                            })
                          }
                        />
                        <Label>Price</Label>
                        <Input
                          type="number"
                          value={formState.price}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              price: e.target.value,
                            })
                          }
                        />
                        <Label>Stock Quantity</Label>
                        <Input
                          type="number"
                          value={formState.stock_quantity}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              stock_quantity: e.target.value,
                            })
                          }
                        />
                        <Label>Category</Label>
                        <Select
                          value={formState.category_id}
                          onValueChange={(val) =>
                            setFormState({ ...formState, category_id: val })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.data?.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Label>Image</Label>
                        <Input
                          type="file"
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              image_url: e.target.files[0],
                            })
                          }
                        />
                      </div>
                      <SheetFooter>
                        <SheetClose asChild>
                          <Button disabled={isUpdating} onClick={handleUpdate}>
                            {isUpdating ? "Saving..." : "Save Changes"}
                          </Button>
                        </SheetClose>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
