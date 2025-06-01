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
import { Truck, PackageCheck, MapPin } from "lucide-react";

export default function Orders() {
  const navigate = useNavigate();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrderstoBuyer(),
  });

  const handleOrderDetail = (id) => {
    navigate(`/orders/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full max-w-5xl w-full space-y-4 mx-auto mt-6 px-4">
        <Skeleton className="h-10 w-1/3 rounded-md" />
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-[60px] w-full rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-5xl w-full mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold mb-6 tracking-tight">Your Orders</h2>

      {orders?.length > 0 ? (
        <div className="rounded-xl border shadow-sm overflow-hidden">
          <Table>
            <TableCaption className="py-4 text-muted-foreground">
              A list of your recent orders
            </TableCaption>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[150px]">Items</TableHead>
                <TableHead className="w-[140px]">Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Tracking</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  onClick={() => handleOrderDetail(order.id)}
                  className="cursor-pointer transition hover:bg-accent"
                >
                  <TableCell className="font-medium flex items-center gap-2">
                    <PackageCheck size={18} className="text-blue-500" />
                    {order.order_items.length} items
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        order.status === "pending"
                          ? "secondary"
                          : order.status === "delivered"
                            ? "success"
                            : "outline"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="flex items-center gap-2">
                    <MapPin size={16} className="text-green-600" />
                    {order.location}
                  </TableCell>

                  <TableCell className="text-green-700 font-semibold">
                    {formatPrice(order.total_amount)}
                  </TableCell>

                  <TableCell className="text-right">
                    <Badge
                      variant={
                        order.tracking_status === "in_transit"
                          ? "default"
                          : order.tracking_status === "delivered"
                            ? "success"
                            : "outline"
                      }
                      className="inline-flex items-center gap-1"
                    >
                      <Truck size={14} />
                      {order.tracking_status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right text-sm text-muted-foreground">
                    {formatDate(order.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-20 space-y-4 text-muted-foreground">
          <h3 className="text-xl font-semibold">No orders yet</h3>
          <p>Start shopping and your orders will show up here 🚀</p>
        </div>
      )}
    </div>
  );
}
