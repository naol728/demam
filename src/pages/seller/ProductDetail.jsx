"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ProductDetailModal({ isOpen, onClose, product }) {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Product Detail</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            View more information about this product.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-52 object-cover rounded-md"
          />
          <h3 className="text-lg font-bold">{product.name}</h3>
          <p className="text-gray-600 text-sm">{product.description}</p>
          <p className="text-base">
            <strong>Price:</strong> {product.price} ETB
          </p>
          <p className="text-base">
            <strong>Stock:</strong> {product.stock_quantity} pcs
          </p>
          {product.location && (
            <p className="text-base">
              <strong>Location:</strong> {product.location}
            </p>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
