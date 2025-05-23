// OrderDetail.jsx
import React, { useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "@/services/orders";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import MapView from "@/components/MapView";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formater";
import { Badge } from "@/components/ui/badge";

export default function OrderDetail() {
  const [productId, setProductId] = useState(null);
  const { id } = useParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order_detail", id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });

  const handleMapview = (product) => {
    setProductId(product);
  };

  if (isLoading)
    return (
      <div className="max-w-5xl mx-auto mt-10 space-y-4">
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* LEFT - Order Summary */}
      <div className="space-y-4">
        <Card className="shadow-lg">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-2xl font-semibold text-primary">
              Order Summary
            </h2>
            <div>
              <span className="font-medium">Status:</span>
              <Badge className="ml-2">{order.status}</Badge>
            </div>
            <div>
              <span className="font-medium">Tracking:</span>
              <Badge className="ml-2">{order.tracking_status}</Badge>
            </div>
            <p>
              <span className="font-medium">Total:</span>{" "}
              {formatPrice(order.total_amount)}
            </p>
            <p>
              <span className="font-medium">Location:</span> {order.location}
            </p>
            <p>
              <span className="font-medium">Coordinates:</span>{" "}
              <span className="text-sm text-muted-foreground">
                {order.latitude}, {order.longitude}
              </span>
            </p>
            <p>
              <span className="font-medium">Created At:</span>{" "}
              {new Date(order.created_at).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT - Items + Map */}
      <div className="md:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold">Ordered Products</h2>
        {order.order_items.map((item) => (
          <Card key={item.id} className="shadow-md hover:shadow-xl transition">
            <CardContent className="flex flex-col sm:flex-row items-center gap-4 p-5">
              <img
                src={item.product_info.image_url}
                alt={item.product_info.name}
                className="w-28 h-28 object-cover rounded-xl border"
              />
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-semibold">
                  {item.product_info.name}
                </h3>
                <p>
                  <span className="font-medium">Price:</span>{" "}
                  {formatPrice(item.price)}
                </p>
                <p>
                  <span className="font-medium">Quantity:</span> {item.quantity}
                </p>

                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>
                    <span className="font-semibold">Seller:</span>{" "}
                    {item.product_info.seller?.name}
                  </div>
                  <div>
                    <span className="font-semibold">Email:</span>{" "}
                    {item.product_info.seller?.email}
                  </div>
                  <div>
                    <span className="font-semibold">Phone:</span>{" "}
                    {item.product_info.seller?.phone}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleMapview(item.product_info.id)}
                >
                  Show on Map
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {productId && (
          <div className="h-96 w-full relative rounded-xl overflow-hidden">
            <MapView order={order} product={productId} />
          </div>
        )}
      </div>
    </div>
  );
}
