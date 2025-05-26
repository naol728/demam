"use client";

import { getAllProductsforlanding } from "@/services/products";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import Loading from "../Loading";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { Link } from "react-router"; // Make sure you're using this correctly
import { formatPrice } from "@/lib/formater";

export default function LandingProducts() {
  const { user, role, loading } = useSelector((state) => state.user);

  const { data, isLoading } = useQuery({
    queryFn: () => getAllProductsforlanding(),
    queryKey: ["products"],
  });

  if (isLoading) return <Loading />;

  const products = data?.data || [];

  return (
    <section id="Products" className="py-10">
      {/* Hero/Header Section */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-foreground">
              Discover Our Latest Products
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Browse quality items handpicked for you. Secure your favorite
              products before they’re gone!
            </p>
          </div>

          {!loading && (
            <div className="flex gap-2">
              {role ? (
                <Button asChild variant="default" size="sm">
                  <Link
                    to={role === "seller" ? "/dashboard/products" : "/products"}
                  >
                    {role === "seller" ? "Go to Dashboard" : "Shop Now"}
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="outline" size="sm">
                  <Link to="/signin">Sign In</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <p className="text-center col-span-full text-muted-foreground">
              No products available at the moment.
            </p>
          ) : (
            products.map((product) => (
              <Card
                key={product.id}
                className="hover:shadow-xl transition-shadow border border-border rounded-xl overflow-hidden bg-card"
              >
                <CardHeader className="p-0">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                </CardHeader>

                <CardContent className="p-4 space-y-2">
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {product.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {product.catagory?.name
                      ? `Category: ${product.catagory.name}`
                      : "Uncategorized"}
                  </p>
                  <p className="text-green-600 font-bold text-lg">
                    {formatPrice(product.price)}
                  </p>
                </CardContent>

                <CardFooter className="p-4 pt-0 text-xs text-foreground/70">
                  📍 {product.location_name || "Unknown location"}
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
