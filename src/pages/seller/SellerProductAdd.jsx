import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast, useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCatagories } from "@/services/catagorie";
import Loading from "@/components/Loading";
import { addnewProduct } from "@/services/products";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router";

export default function SellerProductAdd() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [productimg, setProductimg] = useState();
  const [locationName, setLocationName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
      },
      (err) => {
        toast({
          title: "Error",
          description: "Failed to get location: " + err.message,
          variant: "destructive",
        });
      }
    );
  };

  const { data: categories, isLoading: loadingCatagories } = useQuery({
    queryFn: () => getCatagories(),
    queryKey: ["catagories"],
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => addnewProduct(data),
    mutationKey: ["addproduct"],
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product added successfully!",
      });
      navigate("/dashboard/products");
    },
    onError: (err) => {
      console.log(err);
      toast({
        title: "Error",
        description:
          err?.message ||
          "An unexpected error occurred while adding the product.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name,
      description,
      price: parseFloat(price),
      stock_quantity: parseInt(stockQuantity),
      category_id: categoryId,
      image_url: productimg,
      location_name: locationName,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    await mutate(data);
  };

  if (loadingCatagories) return <Loading />;

  return (
    <Card className="max-w-xl mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Add New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product name"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="99.99"
                required
                min={10}
              />
            </div>

            <div>
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                placeholder="10"
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
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.data.map((category) => (
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
              id="productimg"
              type="file"
              accept="image/*"
              onChange={(e) => setProductimg(e.target.files[0])}
            />
            {productimg && (
              <p className="text-xs text-muted-foreground mt-1">
                Selected: {productimg.name}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="locationName">Location Name</Label>
            <Input
              id="locationName"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g. Addis Ababa"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g. 9.03"
              />
            </div>

            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g. 38.74"
              />
            </div>
          </div>

          <Button type="button" onClick={handleGetLocation}>
            📍 Get My Location
          </Button>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Adding Product..." : "Add Product"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
