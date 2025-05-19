import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formater";

export default function ProductCard({ product }) {
  return (
    <Card className="w-full max-w-[240px] mx-auto shadow-md hover:shadow-lg transition-shadow border ">
      <CardHeader className="p-0">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-40 object-cover rounded-t-md"
        />
      </CardHeader>

      <CardContent className="p-3 space-y-1">
        <h3 className="text-base font-semibold ">{product.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        <div className="flex flex-wrap items-center gap-2 mt-1">
          <Badge variant={product.inStock ? "default" : "outline"}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </Badge>
          <span className="text-xs text-gray-500">
            Qty: {product.stockQuantity}
          </span>
        </div>

        <div className="text-sm font-medium ">{formatPrice(product.price)}</div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-1 p-3 pt-0">
        <Button variant="outline" className="w-full text-sm">
          View Detail
        </Button>
        <Button
          disabled={!product.inStock}
          size="sm"
          className="w-full text-sm"
          onClick={() => console.log("Add to cart:", product.name)}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
