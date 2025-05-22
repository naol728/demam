import React from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "@/services/orders";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function OrderDetail() {
  const { id } = useParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order_detail", id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });

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
    <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* LEFT SIDE - Order Info */}
      <div className="md:col-span-1 space-y-4">
        <Card>
          <CardContent className="p-4 space-y-2">
            <h2 className="text-xl font-bold">Order Summary</h2>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Tracking Status:</strong> {order.tracking_status}
            </p>
            <p>
              <strong>Total Amount:</strong> ${order.total_amount.toFixed(2)}
            </p>
            <p>
              <strong>Location:</strong> {order.location}
            </p>
            <p>
              <strong>Coordinates:</strong> {order.latitude}, {order.longitude}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(order.created_at).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT SIDE - Order Items */}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-2xl font-semibold">Ordered Products</h2>
        {order.order_items.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex items-center gap-4 p-4">
              <img
                src={item.product_info.image_url}
                alt={item.product_info.name}
                className="w-28 h-28 object-cover rounded-xl border"
              />
              <div className="space-y-1">
                <h3 className="text-lg font-medium">
                  {item.product_info.name}
                </h3>
                <p>
                  <strong>Price:</strong> ${item.price.toFixed(2)}
                </p>
                <p>
                  <strong>Quantity:</strong> {item.quantity}
                </p>
                <p>
                  <strong>Seller ID:</strong> {item.product_info.seller_id}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
