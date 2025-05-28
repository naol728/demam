import React, { useState } from "react";
import { useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrder, updateOrderItemStatus } from "@/services/orders";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SellerMapView from "./SellerMapView";
import { formatPrice } from "@/lib/formater";
import { useToast } from "@/hooks/use-toast";

export default function SellerOrderDetail() {
  const [productId, setProductId] = useState(null);
  const [productLat, setProductLat] = useState(null);
  const [productLng, setProductLng] = useState(null);
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: mutateStatus, isPending: isUpdatingStatus } = useMutation({
    mutationFn: updateOrderItemStatus,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Order item status updated successfully.",
      });
      queryClient.invalidateQueries(["order", id]);
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      console.error("Error updating order item status:", err.message);
    },
  });

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

  const handleMapView = ({ id, lat, lng }) => {
    setProductId(id);
    setProductLat(lat);
    setProductLng(lng);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-600">Error: {error.message}</p>;
  }

  const { user, order_items, status, tracking_status, total_amount } = order;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 h-dvh">
      {/* LEFT SIDE - Order Info */}
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm">
          {/* Customer Info */}
          <div>
            <h3 className="font-semibold text-base mb-1">Customer Info</h3>
            <p>
              <strong>Name:</strong> {user?.name}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Phone:</strong> {user?.phone}
            </p>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-base mb-1">
              Order Items ({order_items.length})
            </h3>
            <div className="space-y-6">
              {order_items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 items-start p-2 border rounded-lg"
                >
                  <img
                    src={item.product_info?.image_url}
                    alt={item.product_info?.name}
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                  <div className="space-y-1 flex-1">
                    <p className="font-medium">{item.product_info?.name}</p>
                    <p>Price: {formatPrice(item.product_info?.price)}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>
                      Status: <Badge>{item.status}</Badge>
                    </p>
                    <p>
                      Seller status:{" "}
                      <Badge variant="outline">{item.seller_status}</Badge>
                    </p>
                    <p>
                      Buyer status:{" "}
                      <Badge variant="outline">{item.buyer_status}</Badge>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center mt-2">
                      <Select
                        onValueChange={(value) =>
                          mutateStatus({ id: item.id, seller_status: value })
                        }
                        disabled={isUpdatingStatus}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Update your Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Status Options</SelectLabel>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      {item.status !== "delivered" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleMapView({
                              id: item.product_info.id,
                              lat: item.product_info.latitude,
                              lng: item.product_info.longitude,
                            })
                          }
                        >
                          Show on Map
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Summary */}
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
      <Card className="flex h-80 flex-col">
        <CardHeader>
          <CardTitle>Delivery Location</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          {productId ? (
            <SellerMapView
              order={order}
              product={productId}
              prodyuctlat={productLat}
              productlng={productLng}
            />
          ) : (
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              Select a product to view on map.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
