import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllproductstobuyer } from "@/services/products";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";

export default function Products() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getAllproductstobuyer(),
  });
  const { user } = useSelector((state) => state.user);
  console.log(products);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortOption) {
      case "newest":
        return filtered.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      case "category":
        return filtered.sort((a, b) =>
          a.catagory.name.localeCompare(b.catagory)
        );
      case "stock":
        return filtered.sort((a, b) => b.stock_quantity - a.stock_quantity);
      case "price":
        return filtered.sort((a, b) => b.price - a.price);
      default:
        return filtered;
    }
  }, [products, searchTerm, sortOption]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full w-full  space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          {Array(10).map((product, index) => (
            <div key={index}>
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />{" "}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8  capitalize">
        👋 Welecome Back {user?.name.split(" ")[0]}
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="w-full sm:w-1/2">
          <Label htmlFor="search">Search Products</Label>
          <Input
            id="search"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-1/3">
          <Label htmlFor="sort">Sort Products</Label>
          <Select
            value={sortOption}
            onValueChange={(value) => setSortOption(value)}
          >
            <SelectTrigger id="sort">
              <SelectValue placeholder="Sort products" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="category">Category</SelectItem>
              <SelectItem value="stock">Stock</SelectItem>
              <SelectItem value="price">Price</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                name: product.name,
                description: product.description,
                imageUrl: product.image_url,
                inStock: product.stock_quantity > 0,
                stockQuantity: product.stock_quantity,
                price: product.price,
                location: product.location_name,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground mt-10">
          No products found.
        </div>
      )}
    </div>
  );
}
