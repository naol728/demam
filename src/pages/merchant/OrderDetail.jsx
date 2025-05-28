"use client";

import React, { useState } from "react";
import { useParams } from "react-router";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getOrderById, updateOrderItemStatustobuyer } from "@/services/orders";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import MapView from "@/components/MapView";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formater";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PaymentDialog from "./PaymentDialog";
import { getPaymentsByOrderId } from "@/services/payment";

export default function OrderDetail() {
  const [productId, setProductId] = useState(null);
  const { id } = useParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order_detail", id],
    queryFn: () => getOrderById(id),
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

  const { mutate: mutateStatus, isPending: isUpdatingStatus } = useMutation({
    mutationFn: updateOrderItemStatustobuyer,
    onSuccess: () => {
      toast({ title: "Success", description: "Status updated successfully." });
      queryClient.invalidateQueries(["order_detail", id]);
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err?.message || "An error occurred.",
        variant: "destructive",
      });
    },
  });

  const handleOpenPaymentDialog = (orderItemId) => {
    setSelectedOrderItemId(orderItemId);
    setDialogOpen(true);
  };

  const handleMapview = (productId) => {
    setProductId(productId);
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
      {/* Order Summary */}
      <div className="space-y-4">
        <Card className="shadow-xl border border-muted">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-bold text-primary">Order Summary</h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Status:</span> <Badge>{order.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Tracking:</span>{" "}
                <Badge variant="outline">{order.tracking_status}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>{" "}
                <span>{formatPrice(order.total_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Location:</span> <span>{order.location}</span>
              </div>
              <div className="flex justify-between">
                <span>Coordinates:</span>{" "}
                <span className="text-muted-foreground text-xs">
                  {order.latitude}, {order.longitude}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Created At:</span>{" "}
                <span>{new Date(order.created_at).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <div className="md:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold mb-4">Ordered Products</h2>
        {order.order_items.map((item) => (
          <Card
            key={item.id}
            className="border border-muted shadow-lg hover:shadow-xl transition duration-300"
          >
            <CardContent className="p-5 flex flex-col sm:flex-row gap-6">
              <img
                src={item.product_info.image_url}
                alt={item.product_info.name}
                className="w-32 h-32 object-cover rounded-lg border"
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
                  <span className="font-medium">Payment Method:</span>{" "}
                  {item.product_info.payment_method}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Status: {item.status}</Badge>
                  <Badge variant="secondary">
                    Seller: {item.seller_status}
                  </Badge>
                  <Badge variant="secondary">Buyer: {item.buyer_status}</Badge>
                  <Badge variant="outline">Qty: {item.quantity}</Badge>
                </div>

                <div className="space-y-1 text-sm text-muted-foreground mt-2">
                  <div>
                    <strong>Seller:</strong> {item.product_info.seller?.name}
                  </div>
                  <div>
                    <strong>Email:</strong> {item.product_info.seller?.email}
                  </div>
                  <div>
                    <strong>Phone:</strong> {item.product_info.seller?.phone}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-4 items-center">
                  <Select
                    onValueChange={(value) =>
                      mutateStatus({ id: item.id, buyer_status: value })
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
                  {paymentMap[item.id] ? (
                    <div className="space-y-1 text-sm">
                      <Badge variant="secondary">
                        Payment Status: {paymentMap[item.id].status}
                      </Badge>
                      <div>
                        <strong>Amount:</strong>{" "}
                        {formatPrice(paymentMap[item.id].amount)}
                      </div>
                      <div>
                        <strong>Method:</strong>{" "}
                        {paymentMap[item.id].payment_method}
                      </div>
                      <div>
                        <strong>Paid At:</strong>{" "}
                        {new Date(
                          paymentMap[item.id].created_at
                        ).toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenPaymentDialog(item.id)}
                    >
                      Add Payment
                    </Button>
                  )}

                  {item.status !== "delivered" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMapview(item.product_info.id)}
                    >
                      Show on Map
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {productId && (
          <div className="h-96 w-full rounded-xl overflow-hidden border shadow-inner">
            <MapView order={order} product={productId} />
          </div>
        )}
      </div>

      {/* Payment Dialog */}
      <PaymentDialog
        orderItemId={selectedOrderItemId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
