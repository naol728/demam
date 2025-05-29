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
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/formater";
import {
  addcartitemquantity,
  deleteCartItem,
  getallcartstobuyer,
} from "@/services/cart";
import { createAnOrder } from "@/services/orders";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { Minus, Plus, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const naviage = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: carts = [], isLoading } = useQuery({
    queryFn: getallcartstobuyer,
    queryKey: ["carts_item"],
  });

  const filteredCarts = carts?.filter((cart) =>
    cart?.product?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPrice = filteredCarts?.reduce(
    (acc, cart) => acc + cart.product.price * cart.quantity,
    0
  );

  const { mutate: updateCartMutate, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, op }) => addcartitemquantity(id, op),
    onSuccess: () => {
      queryClient.invalidateQueries(["carts_item"]);
      toast({ title: "Success", description: "Cart updated." });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteCartMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries(["carts_item"]);
      toast({ title: "Removed", description: "Item removed from cart." });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const { mutate: createOrder, isPending: creatingOrder } = useMutation({
    mutationFn: () => createAnOrder({ latitude, longitude, location }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Order created successfully.",
      });
      naviage("/orders");
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
      },
      (err) => {
        toast({
          title: "Location Error",
          description: "Failed to fetch location: " + err.message,
          variant: "destructive",
        });
      }
    );
  };

  if (isLoading) {
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
  }

  return (
    <div className="max-w-5xl mx-auto px-4 mt-10 space-y-8">
      {carts.length > 0 ? (
        <>
          {/* Search */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Your Cart</h1>
            <Input
              type="text"
              placeholder="Search product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
          </div>

          {/* Table */}
          <Table>
            <TableCaption>Your selected products</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead>Total</TableHead>
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
                      className="w-12 h-12 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell>{cart?.quantity}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          updateCartMutate({ id: cart.product.id, op: "dec" })
                        }
                      >
                        <Minus size={16} />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => deleteCartMutate(cart.product.id)}
                      >
                        <Trash size={16} />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          updateCartMutate({ id: cart.product.id, op: "inc" })
                        }
                      >
                        <Plus size={16} />
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
                <TableCell colSpan={4} className="text-right font-semibold">
                  Total
                </TableCell>
                <TableCell className="font-bold text-green-600">
                  {formatPrice(totalPrice)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          {/* Location Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Delivery Location</Label>
              <Input
                id="location"
                placeholder="e.g. Addis Ababa"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-4">
            <Button onClick={handleGetLocation} disabled={creatingOrder}>
              📍 Auto-Fill My Location
            </Button>
            <Button
              onClick={() => createOrder()}
              disabled={creatingOrder || !location || !latitude || !longitude}
            >
              {creatingOrder ? "Placing Order..." : "Confirm Order"}
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">
            Your cart is empty. Add something 😊
          </h2>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
