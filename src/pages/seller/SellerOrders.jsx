import { getOrders } from "@/services/orders";
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
import { formatPrice } from "@/lib/formater";

export default function SellerOrders() {
  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });

  console.log(data);

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <Table>
        <TableCaption>A list of Recived Orders.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Order Name</TableHead>
            <TableHead>Order Image</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>User Phone</TableHead>
            <TableHead>User Image</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead>Order Quantity</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ) : (
            <>
              {data?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.product.name}
                  </TableCell>
                  <TableCell className="font-medium">
                    <img
                      src={order.product.image_url}
                      alt={order.order.user_id.name}
                      className="size-10"
                    />
                  </TableCell>
                  <TableCell>{order.order.user_id.name}</TableCell>
                  <TableCell>
                    {order.order.user_id.phone
                      ? order.order.user_id.phone
                      : "null"}
                  </TableCell>
                  <TableCell>
                    <img
                      src={order.order.user_id.profileimg}
                      alt={order.order.user_id.name}
                      className="size-10"
                    />
                  </TableCell>
                  <TableCell>{order.order.status}</TableCell>
                  <TableCell>{order.quantity} pices</TableCell>
                  <TableCell>{formatPrice(order.price)}</TableCell>
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
        {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>
    </div>
  );
}
