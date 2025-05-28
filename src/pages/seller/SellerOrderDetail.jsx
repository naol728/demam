import React, { useState } from "react";
import { useParams } from "react-router";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
import { getPaymentsByOrderId } from "@/services/payment";
import SellerPaymentInfoDialog from "./SellerPaymentInfoDialog";
import { DialogTrigger } from "@/components/ui/dialog";

export default function SellerOrderDetail() {
  const [productId, setProductId] = useState(null);
  const [productLat, setProductLat] = useState(null);
  const [productLng, setProductLng] = useState(null);
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState();

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
  const paymentResults = useQueries({
    queries:
      order?.order_items.map((item) => ({
        queryKey: ["payment_info", item.id],
        queryFn: () => getPaymentsByOrderId(item.id),
        enabled: !!item.id,
      })) || [],
  });

  const paymentMap = {};

  if (
    order?.order_items &&
    paymentResults.length === order.order_items.length
  ) {
    order.order_items.forEach((item, index) => {
      const result = paymentResults[index];
      const firstPayment = result?.data?.[0];
      if (firstPayment) {
        paymentMap[item.id] = firstPayment;
      }
    });
  }

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
        <CardContent className="space-y-8 text-sm">
          {/* Customer Info */}
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-primary">
              Customer Information
            </h3>
            <p>
              <span className="font-medium">Name:</span> {user?.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {user?.email}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {user?.phone}
            </p>
          </div>

          <Separator />

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">
              Ordered Items ({order_items.length})
            </h3>
            {order_items.map((item) => (
              <Card key={item.id} className="border p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <img
                    src={item.product_info?.image_url}
                    alt={item.product_info?.name}
                    className="w-full md:w-24 h-24 object-cover rounded-md border"
                  />
                  <div className="flex-1 space-y-1">
                    <h4 className="text-base font-semibold">
                      {item.product_info?.name}
                    </h4>
                    <p className="text-muted-foreground">
                      <span className="font-medium">Price:</span>{" "}
                      {formatPrice(item.product_info?.price)} &nbsp;|&nbsp;
                      <span className="font-medium">Quantity:</span>{" "}
                      {item.quantity}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge>Status: {item.status}</Badge>
                      <Badge variant="outline">
                        Seller: {item.seller_status}
                      </Badge>
                      <Badge variant="outline">
                        Buyer: {item.buyer_status}
                      </Badge>
                    </div>

                    {paymentMap[item.id] ? (
                      <div className="mt-2 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="success">
                            Payment: {paymentMap[item.id].status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setOpen(true)}
                          >
                            View Payment Info
                          </Button>
                        </div>
                        <SellerPaymentInfoDialog
                          open={open}
                          onOpenChange={setOpen}
                          id={paymentMap[item.id].id}
                          image={paymentMap[item.id].payment_img}
                          amount={formatPrice(paymentMap[item.id].amount)}
                          date={new Date(
                            paymentMap[item.id].created_at
                          ).toLocaleString()}
                          method={paymentMap[item.id].payment_method}
                        />
                      </div>
                    ) : (
                      <div className="mt-2">
                        <Badge variant="secondary">Payment: Not Paid</Badge>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center mt-4">
                      <Select
                        onValueChange={(value) =>
                          mutateStatus({ id: item.id, seller_status: value })
                        }
                        disabled={isUpdatingStatus}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Update Status" />
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
                          variant="secondary"
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
              </Card>
            ))}
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-primary">
              Order Summary
            </h3>
            <p>
              <span className="font-medium">Order Status:</span>{" "}
              <Badge>{status}</Badge>
            </p>
            <p>
              <span className="font-medium">Tracking:</span> {tracking_status}
            </p>
            <p>
              <span className="font-medium">Total Amount:</span>{" "}
              {formatPrice(total_amount)}
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
