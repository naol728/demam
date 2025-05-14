import { getallProducts } from "@/services/products";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function SellerProducts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => getallProducts(),
  });

  console.log(data);

  return <div>this is sellers products page </div>;
}
