import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import Loading from "@/components/Loading";
import { setProduct } from "@/store/products/productsSlice";
import { getCatagories } from "@/services/catagorie";
import { updateProduct } from "@/services/products"; // Make sure this is correct
import { useToast } from "@/hooks/use-toast";

export function SellerProductEdit() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { productedit, loading: isProductLoading } = useSelector(
    (state) => state.Products
  );
  const { toast } = useToast();

  const [productimg, setProductimg] = useState(null);
  const [categoryId, setCategoryId] = useState(productedit?.category_id);

  const { data: categories, isLoading: loadingCatagories } = useQuery({
    queryFn: getCatagories,
    queryKey: ["catagories"],
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    mutationKey: ["product"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        titile: "success",
        description: "product updated successfully",
      });
    },
    onError: (err) => {
      toast({
        titile: "Error",
        description: err.message || "something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setProduct({ name, value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      ...productedit,
      category_id: categoryId ?? productedit.category_id,
      image_url: productimg || productedit.image_url,
    };
    // console.log(formData);
    try {
      mutate({ id: productedit.id, data: formData });
      console.log("Updated:", formData);
    } catch (error) {
      console.error("Update error:", error.message);
    }
  };

  if (isProductLoading || loadingCatagories) return <Loading />;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={productedit?.name}
          name="name"
          onChange={handleChange}
          placeholder="Product name"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={productedit?.description}
          name="description"
          onChange={handleChange}
          placeholder="Write a short product description..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={productedit?.price}
            name="price"
            placeholder="99.99"
            onChange={handleChange}
            required
            min={10}
          />
        </div>

        <div>
          <Label htmlFor="stock_quantity">Stock Quantity</Label>
          <Input
            id="stock_quantity"
            type="number"
            name="stock_quantity"
            value={productedit?.stock_quantity}
            placeholder="10"
            onChange={handleChange}
            required
            min={1}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          value={categoryId}
          onValueChange={setCategoryId}
          disabled={loadingCatagories}
        >
          <SelectTrigger id="categories" className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.data?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="productimg">Product Image</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setProductimg(file);
            }
          }}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
