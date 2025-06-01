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
      getNextPageParam: (lastPage) => {
        return lastPage?.page < lastPage?.totalPages
          ? lastPage?.page + 1
          : undefined;
      },
    });

  const {
    data: cart_items,
    error: cart_itemserr,
    isLoading: cartitemsloading,
  } = useQuery({
    queryKey: ["cart_items"],
    queryFn: getallcartstobuyer,
  });

  const allProducts = data?.pages.flatMap((page) => page.data) || [];

  const isInCart = (productId) =>
    cart_items?.some((item) => item.product_id === productId);

  const inCartQunetity = (productid) =>
    cart_items?.find((item) => item.product_id === productid);

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
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  if (isLoading || cartitemsloading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-[320px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (cart_itemserr) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-semibold text-destructive mb-4">
          Error loading cart items
        </h1>
        <p className="text-muted-foreground">{cart_itemserr.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">
        👋 Welcome back, {user?.name?.split(" ")[0]}
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
        <div className="w-full md:w-1/2">
          <Label htmlFor="search">Search Products</Label>
          <Input
            id="search"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="w-full md:w-1/3">
          <Label htmlFor="sort">Sort Products</Label>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger id="sort" className="mt-1">
              <SelectValue placeholder="Sort by..." />
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

      {filteredProducts.length > 0 ? (
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product, index) => {
            const productCard = (
              <ProductCard
                key={product.id}
                product={product}
                isInCart={isInCart}
                inCartQunetity={inCartQunetity}
              />
            );

            if (index === filteredProducts?.length - 1) {
              return (
                <div key={product.id} ref={lastProductRef}>
                  {productCard}
                </div>
              );
            }

            return productCard;
          })}
        </div>
      ) : (
        <div className="text-center text-muted-foreground text-sm mt-12">
          No products found.
        </div>
      )}

      {isFetchingNextPage && (
        <div className="text-center mt-8 text-sm text-muted-foreground animate-pulse">
          Loading more products...
        </div>
      )}
    </div>
  );
}
