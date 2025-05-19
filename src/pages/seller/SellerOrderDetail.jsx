import { getOrder } from "@/services/orders";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import MapView from "@/components/MapView";

export default function SellerOrderDetail() {
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
  console.log(order);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (isError) return <p className="text-red-600">Error: {error.message}</p>;

  const {
    user,
    order_items,
    status,
    tracking_status,
    total_amount,
    location,
    latitude,
    longitude,
  } = order;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 h-dvh">
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold text-base">Customer</h3>
            <p>Name: {user?.name}</p>
            <p>Email: {user?.email}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-base">Products</h3>
            <ul className="list-disc list-inside space-y-2">
              {order_items.map((item) => (
                <li key={item.id}>
                  <p className="font-medium">{item.product_info.name}</p>
                  <p>Price: ${item.product_info.price}</p>
                  <p>Quantity: {item.quantity}</p>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <p>
              <strong>Status:</strong> {status}
            </p>
            <p>
              <strong>Tracking Status:</strong> {tracking_status}
            </p>
            <p>
              <strong>Total:</strong> ${total_amount}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* RIGHT SIDE - Map */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Location</CardTitle>
        </CardHeader>
        <CardContent className="h-[90%] p-0 rounded overflow-hidden">
          <MapView
            latitude={latitude}
            longitude={longitude}
            location={location}
          />
        </CardContent>
      </Card>
    </div>
  );
}
