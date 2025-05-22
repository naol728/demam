import { getOrderstoBuyer } from "@/services/orders";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatPrice } from "@/lib/formater";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router";

export default function Orders() {
  const naviagte = useNavigate();
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrderstoBuyer(),
  });

  const handleOrderDetail = (id) => {
    naviagte(`/orders/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex h-full max-w-5xl w-full space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index}>
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-5xl mx-auto">
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Order Items</TableHead>
            <TableHead className="w-[100px]">Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead className="text-right">Tracking Status</TableHead>
            <TableHead className="text-right">Created Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow
                key={order.id}
                onClick={() => handleOrderDetail(order.id)}
              >
                <TableCell className="font-medium">
                  {order.order_items.length} items
                </TableCell>
                <TableCell className="font-medium">{order.location}</TableCell>
                <TableCell>
                  <Badge>{order.status}</Badge>
                </TableCell>
                <TableCell>{formatPrice(order.total_amount)}</TableCell>
                <TableCell className="text-right">
                  <Badge> {order.tracking_status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  {formatDate(order.created_at)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <>please create an order and come back</>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
