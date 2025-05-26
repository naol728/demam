import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
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
import { getallcartstobuyer } from "@/services/cart";

export default function Products() {
  const { user } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const limit = 10;
  const observerRef = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["products"],
      queryFn: ({ pageParam = 1 }) => getAllproductstobuyer(pageParam, limit),
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.page < lastPage.totalPages) {
          return lastPage.page + 1;
        }
        return undefined;
      },
    });
  const {
    data: cart_items,
    error: cart_itemserr,
    isLoading: cartitemsloading,
  } = useQuery({
    queryKey: ["cart_items"],
    queryFn: () => getallcartstobuyer(),
  });

  const allProducts = data?.pages.flatMap((page) => page.data) || [];
  const isInCart = (productId) => {
    return cart_items?.some((item) => item.product_id === productId);
  };
  const inCartQunetity = (productid) => {
    return cart_items?.find((item) => item.product_id === productid);
  };
  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter(
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
          a.catagory.name.localeCompare(b.catagory.name)
        );
      case "stock":
        return filtered.sort((a, b) => b.stock_quantity - a.stock_quantity);
      case "price":
        return filtered.sort((a, b) => b.price - a.price);
      default:
        return filtered;
    }
  }, [allProducts, searchTerm, sortOption]);

  const lastProductRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  if (isLoading) {
    return (
      <div className="flex  h-full max-w-5xl w-full  space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index}>
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 capitalize">
        👋 Welcome Back {user?.name?.split(" ")[0]}
      </h1>

      {/* Search and Sort */}
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
      {filteredProducts?.length > 0 ? (
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product, index) => {
            if (index === filteredProducts?.length - 1) {
              return (
                <div key={product.id} ref={lastProductRef}>
                  <ProductCard
                    product={product}
                    isInCart={isInCart}
                    inCartQunetity={inCartQunetity}
                  />
                </div>
              );
            }
            return (
              <ProductCard
                key={product.id}
                product={product}
                isInCart={isInCart}
                inCartQunetity={inCartQunetity}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center text-muted-foreground mt-10">
          No products found.
        </div>
      )}

      {isFetchingNextPage && (
        <div className="text-center mt-4 text-sm text-muted-foreground">
          Loading more products...
        </div>
      )}
    </div>
  );
}
