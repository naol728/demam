"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formater";

export default function ProductDetailModal({ isOpen, onClose, product }) {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Product Detail</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            View full information about this product.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-52 object-cover rounded-md"
          />

          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-sm text-gray-600">{product.description}</p>

          <div className="flex items-center justify-between">
            <Badge variant={product.stock_quantity > 0 ? "default" : "outline"}>
              {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
            </Badge>
            <span className="text-sm">Qty: {product.stock_quantity}</span>
          </div>

          <div className="text-base font-medium ">
            Price: {formatPrice(product.price)} ETB
          </div>

          {product.location_name && (
            <div className="text-sm">
              <strong>Location:</strong> {product.location_name}
            </div>
          )}

          {product.category?.name && (
            <div className="text-sm">
              <strong>Category:</strong> {product.category.name}
            </div>
          )}

          {product.user && (
            <div className="text-sm space-y-1">
              <div>
                <strong>Seller:</strong> {product.user.name}
              </div>
              <div className="text-muted-foreground">
                📞 {product.user.phone}
              </div>
              <div className="text-muted-foreground truncate">
                ✉️ {product.user.email}
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-4">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
