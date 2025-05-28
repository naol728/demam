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
  const [payment_method, setPaymentmethod] = useState("");

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
    queryFn: getCatagories,
    queryKey: ["catagories"],
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addnewProduct,
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
      payment_method,
    };
    mutate(data);
  };

  if (loadingCatagories) return <Loading />;

  return (
    <Card className="max-w-2xl mx-auto p-6 shadow-lg border rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-center">
          🛒 Add New Product
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Stylish sneakers..."
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a brief product description..."
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
                  min={1}
                />
              </div>

              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  placeholder="e.g. 100"
                  required
                  min={1}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="payment method">Payment Methods</Label>
              <Input
                id="payment_method"
                type="text"
                value={payment_method}
                onChange={(e) => setPaymentmethod(e.target.value)}
                placeholder="e.g. tele birr 0912345678"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={categoryId}
                onValueChange={setCategoryId}
                disabled={loadingCatagories}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.data.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
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
                <p className="text-sm text-muted-foreground mt-1">
                  Selected: {productimg.name}
                </p>
              )}
            </div>
          </div>

          {/* Location Info */}
          <div className="pt-4 space-y-4 border-t">
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
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="9.03"
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="38.74"
                />
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              onClick={handleGetLocation}
              className="w-full"
            >
              📍 Auto-Fill Location
            </Button>
          </div>

          {/* Actions */}
          <div className="pt-6">
            <Button
              type="submit"
              className="w-full text-lg"
              disabled={isPending}
            >
              {isPending ? "Adding..." : "➕ Add Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
