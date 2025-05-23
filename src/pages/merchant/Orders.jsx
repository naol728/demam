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

  console.log(orders);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full max-w-5xl w-full space-y-4 mx-auto mt-6">
        <Skeleton className="h-10 w-1/3 rounded-md" />
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-[60px] w-full rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-5xl w-full mx-auto mt-8 p-4">
      <h2 className="text-2xl font-semibold mb-6">Your Orders</h2>
      {orders?.length > 0 ? (
        <Table className="rounded-md border overflow-hidden shadow-sm">
          <TableCaption className="py-2 text-muted-foreground">
            A list of your recent orders.
          </TableCaption>
          <TableHeader className="bg-background/90">
            <TableRow>
              <TableHead className="w-[120px]">Items</TableHead>
              <TableHead className="w-[160px]">Status</TableHead>
              <TableHead> Location</TableHead>
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
                className="cursor-pointer hover:bg-muted transition"
              >
                <TableCell className="font-medium flex items-center gap-2">
                  <PackageCheck size={18} className="text-blue-500" />
                  {order.order_items.length} items
                </TableCell>

                <TableCell>
                  <Badge variant="outline">{order.status}</Badge>
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <MapPin size={16} className="text-green-500" />
                  {order.location}
                </TableCell>
                <TableCell>{formatPrice(order.total_amount)}</TableCell>
                <TableCell className="text-right">
                  <Badge className="inline-flex items-center gap-1">
                    <Truck size={14} />
                    {order.tracking_status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {formatDate(order.created_at)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-16 text-gray-500 text-lg">
          No orders found. Please create one and come back 🚀
        </div>
      )}
    </div>
  );
}
