import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/formater";
import {
  addcartitemquantity,
  deleteCartItem,
  getallcartstobuyer,
} from "@/services/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { Minus, Plus, Trash } from "lucide-react";
import Checkout from "./ChapaCheckout";
import ChapaCheckout from "./ChapaCheckout";

export default function Cart() {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const { data: carts, isLoading } = useQuery({
    queryFn: () => getallcartstobuyer(),
    queryKey: ["carts_item"],
  });

  const filteredCarts = carts?.filter((cart) =>
    cart?.product?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPrice = filteredCarts?.reduce(
    (acc, cart) => acc + cart.product.price * cart.quantity,
    0
  );
  const queryClient = useQueryClient();

  const { mutate: updateCartMutate, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, op }) => addcartitemquantity(id, op),
    onSuccess: () => {
      queryClient.invalidateQueries(["cart_items", "products"]);
      toast({ title: "Success", description: "Cart updated." });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteCartMutate, isPending: isDeleting } = useMutation({
    mutationFn: (id) => deleteCartItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["cart_items", "products"]);
      toast({ title: "Removed", description: "Product removed from cart." });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message || "Failed to remove item",
        variant: "destructive",
      });
    },
  });

  const handleCheckout = () => {
    navigate("/checkout");
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
    <div className="max-w-5xl mx-auto mt-10 px-4">
      {carts.length > 0 ? (
        <>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search by product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md"
            />
          </div>

          <Table>
            <TableCaption>A list of Cart Items</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Product Image</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Update Quantity</TableHead>
                <TableHead>Total Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCarts?.map((cart) => (
                <TableRow key={cart?.id}>
                  <TableCell>{cart?.product?.name}</TableCell>
                  <TableCell>
                    <img
                      src={cart?.product?.image_url}
                      alt={cart?.product?.name}
                      className="size-10 rounded-lg"
                    />
                  </TableCell>
                  <TableCell>{cart?.quantity}</TableCell>
                  <TableCell>
                    <div className="flex  w-full items-center space-x-1">
                      <Button
                        disabled={isUpdating}
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateCartMutate({ id: cart.product.id, op: "dec" })
                        }
                      >
                        <Minus />
                      </Button>
                      <Button
                        disabled={isDeleting}
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteCartMutate(cart.product.id)}
                      >
                        <Trash />
                      </Button>
                      <Button
                        disabled={isUpdating}
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateCartMutate({ id: cart.product.id, op: "inc" })
                        }
                      >
                        <Plus />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatPrice(cart?.product?.price * cart?.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>Total</TableCell>
                <TableCell>{formatPrice(totalPrice)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          <div className="flex justify-center items-center">
            {/* <Button
              className="w-full max-w-sm mx-auto mt-10 "
              onClick={handleCheckout}
            >
              Checkout
            </Button> */}
            <ChapaCheckout
              amount={totalPrice}
              user={{
                name: "Naol Meseret",
                email: "naol@example.com",
                phone: "0912345678",
              }}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-5">
          <div className="text-xl font-semibold text-center">
            You have no cart items. Please add some 😁
          </div>
          <Link to="/products">
            <Button>Go Back to Products</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
