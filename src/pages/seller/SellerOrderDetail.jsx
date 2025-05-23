import React, { useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getOrder } from "@/services/orders";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import SellerMapView from "./SellerMapView";
import { formatPrice } from "@/lib/formater";

export default function SellerOrderDetail() {
  const [productId, setProductId] = useState(null);
  const [prodyuctlat, setProducTlat] = useState(null);
  const [productlng, setProductlng] = useState(null);
  const { id } = useParams();

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrder(id),
    enabled: !!id,
  });

  const handleMapview = (data) => {
    const { id, lat, lng } = data;
    setProductId(id);
    setProducTlat(lat);
    setProductlng(lng);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (isError) return <p className="text-red-600">Error: {error.message}</p>;

  const { user, order_items, status, tracking_status, total_amount } = order;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 h-dvh">
      {/* LEFT SIDE - Order Info */}
      <Card className="overflow-auto">
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold text-base">Customer Info</h3>
            <p>Name: {user?.name}</p>
            <p>Email: {user?.email}</p>
            <p>Phone: {user?.phone}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-base mb-1">
              Order Items ({order_items.length})
            </h3>
            <div className="space-y-4">
              {order_items.map((item) => (
                <div key={item.id} className="flex gap-4 items-start">
                  <img
                    src={item.product_info?.image_url}
                    alt={item.product_info?.name}
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                  <div className="space-y-1">
                    <p className="font-medium">{item.product_info?.name}</p>
                    <p>Price: {formatPrice(item.product_info?.price)}</p>
                    <p>Quantity: {item.quantity}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleMapview({
                          id: item.product_info.id,
                          lat: item.product_info.latitude,
                          lng: item.product_info.longitude,
                        })
                      }
                    >
                      Show on Map
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-1">
            <p>
              <strong>Status:</strong> <Badge>{status}</Badge>
            </p>
            <p>
              <strong>Tracking Status:</strong> {tracking_status}
            </p>
            <p>
              <strong>Total:</strong> {formatPrice(total_amount)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* RIGHT SIDE - Map */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Delivery Location</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          {productId ? (
            <SellerMapView
              order={order}
              product={productId}
              prodyuctlat={prodyuctlat}
              productlng={productlng}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a product to view on map.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
