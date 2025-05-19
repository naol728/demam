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
import { addToCart } from "@/services/cart";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function ProductCard({ product }) {
  const [showDetail, setShowDetail] = useState(false);
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ["products"],
    mutationFn: (id) => addToCart(id),
    onSuccess: () => {
      toast({
        title: "Sucesss",
        description: "product added to cart sucessfully",
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message || "somthing is wrong",
        variant: "destructive",
      });
    },
  });
  const handleaddtocart = (id) => {
    if (!id) return;
    mutate(id);
  };

  return (
    <Card className="w-full max-w-[240px] mx-auto shadow-md hover:shadow-lg transition-shadow h-max  border rounded-lg">
      <ProductDetailModal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        product={product}
      />

      <CardHeader className="p-0">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-80  object-cover rounded-t-lg"
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

        <div className="text-sm font-medium ">{formatPrice(product.price)}</div>

        <div className="space-y-1 mt-1 text-xs ">
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
        <Button
          disabled={!product.stock_quantity > 0 || isPending}
          size="sm"
          className="w-full"
          onClick={() => handleaddtocart(product.id)}
        >
          {isPending ? "Adding to Cart" : " Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
