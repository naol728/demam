import { getOrder } from "@/services/orders";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import MapView from "@/components/MapView";
import { formatPrice } from "@/lib/formater";
import { Badge } from "@/components/ui/badge";

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
    product,
    quantity,
    price,
    status,
    tracking_status,
    total_amount,
    location,
    latitude,
    longitude,
    order_items,
  } = order;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 h-dvh">
      {/* LEFT SIDE - Order Info */}
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold text-base">Customer</h3>
            <p>Name: {user?.name}</p>
            <p>Email: {user?.email}</p>
            <p>Phone: {user?.phone}</p>
          </div>

          <Separator />
          <div>
            {" "}
            <span className="font-bold mr-2">Order Items:</span>
            {order_items.length} items
          </div>
          <div>
            <h3 className="font-semibold text-base">Products</h3>
            {order_items.map((orderitem) => (
              <div className="" key={orderitem.id}>
                <div className="space-y-1 ">
                  <p className="font-medium">{orderitem.product_info?.name}</p>
                  <img
                    src={orderitem.product_info?.image_url}
                    alt={orderitem.product_info?.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <p>Price: {formatPrice(orderitem.product_info?.price)}</p>
                  <p>Quantity: {orderitem.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div>
            <p>
              <strong>Status:</strong>
              <Badge> {status}</Badge>
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
      <Card>
        <CardHeader>
          <CardTitle>Delivery Location</CardTitle>
        </CardHeader>
        <CardContent className="h-full p-0 rounded overflow-hidden">
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
