import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formater";
import { useState } from "react";
import ProductDetailModal from "@/pages/seller/ProductDetail";
import {
  addcartitemquantity,
  addToCart,
  deleteCartItem,
} from "@/services/cart";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, Trash } from "lucide-react";

export default function ProductCard({ product, isInCart, inCartQunetity }) {
  const [showDetail, setShowDetail] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutate: addCartMutate,
    isPending: isAdding,
    isError: addcarterror,
  } = useMutation({
    mutationKey: ["cart-add", product.id],
    mutationFn: () => addToCart(product.id),
    onSuccess: () => {
      queryClient.invalidateQueries(["cart_items", "products"]);
      toast({ title: "Success", description: "Product added to cart." });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

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
    mutationFn: () => deleteCartItem(product.id),
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
  if (addcarterror) {
    return <div className="text-red-500">{addcarterror.message}</div>;
  }

  return (
    <Card className="w-full max-w-[240px] mx-auto shadow-md hover:shadow-lg transition-shadow border rounded-lg">
      <ProductDetailModal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        product={product}
      />

      <CardHeader className="p-0">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-80 object-cover rounded-t-lg"
        />
      </CardHeader>

      <CardContent className="p-3 space-y-2">
        <h3 className="text-base font-semibold line-clamp-1">{product.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={product.stock_quantity > 0 ? "default" : "outline"}>
            {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
          </Badge>
          <span className="text-xs text-gray-500">
            Qty: {product.stock_quantity}
          </span>
        </div>

        <div className="text-sm font-medium">{formatPrice(product.price)}</div>

        <div className="space-y-1 mt-1 text-xs">
          <div>
            <span className="font-medium">Category:</span>{" "}
            <span>{product?.catagory?.name || "Unknown"}</span>
          </div>
          <div>
            <span className="font-medium">Seller:</span>{" "}
            <span>{product?.user?.name}</span>
          </div>
          <div className="text-muted-foreground">{product?.user?.phone}</div>
          <div className="text-muted-foreground truncate">
            {product?.user?.email}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 p-3 pt-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setShowDetail(true)}
        >
          View Detail
        </Button>

        {isInCart(product.id) ? (
          <>
            <div className="text-xs font-mono font-bold">
              items: {inCartQunetity(product.id)?.quantity} {product.name}
            </div>
            <div className="flex justify-between w-full items-center space-x-1">
              <Button
                disabled={!product.stock_quantity || isUpdating}
                variant="outline"
                size="icon"
                onClick={() => updateCartMutate({ id: product.id, op: "dec" })}
              >
                <Minus />
              </Button>
              <Button
                disabled={isDeleting}
                variant="destructive"
                size="icon"
                onClick={() => deleteCartMutate()}
              >
                <Trash />
              </Button>
              <Button
                disabled={
                  !product.stock_quantity ||
                  isUpdating ||
                  inCartQunetity(product.id)?.quantity >= product.stock_quantity
                }
                variant="outline"
                size="icon"
                onClick={() => updateCartMutate({ id: product.id, op: "inc" })}
              >
                <Plus />
              </Button>
            </div>
          </>
        ) : (
          <Button
            disabled={!product.stock_quantity || isAdding}
            size="sm"
            className="w-full"
            onClick={() => addCartMutate()}
          >
            {isAdding ? "Adding..." : "Add to Cart"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
