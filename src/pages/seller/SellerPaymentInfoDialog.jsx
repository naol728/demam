import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formater";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { updatePaymentStatustobuyer } from "@/services/payment";
import { Loader2, X } from "lucide-react";

export default function SellerPaymentInfoDialog({
  id,
  image,
  amount,
  date,
  method,
  open,
  onOpenChange,
}) {
  const [status, setStatus] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: updatePaymentStatus, isPending } = useMutation({
    mutationKey: ["updatePaymentStatus"],
    mutationFn: updatePaymentStatustobuyer,
    onSuccess: () => {
      queryClient.invalidateQueries(["payment_info", id]);
      toast({
        title: "Success",
        description: "Payment status updated successfully.",
      });
      onOpenChange(false);
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });

  if (!open) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Seller Payment Details
            </DialogTitle>
            <DialogDescription>
              Review and update the payment status sent to the seller.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4 mt-4">
            <img
              src={image}
              alt="Product"
              className="w-32 h-32 rounded-xl object-cover border shadow cursor-pointer"
              onClick={() => setPreviewOpen(true)}
            />

            <div className="text-center space-y-2">
              <p className="text-lg font-medium">
                Amount:{" "}
                <span className="text-primary font-semibold">
                  {formatPrice(amount)}
                </span>
              </p>

              <p>
                Method:{" "}
                <Badge variant="outline" className="capitalize">
                  {method}
                </Badge>
              </p>

              <p className="text-sm text-muted-foreground">
                Paid on: {new Date(date).toLocaleString()}
              </p>
            </div>

            <div className="w-full space-y-2">
              <Select
                onValueChange={setStatus}
                disabled={isPending}
                value={status}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status Options</SelectLabel>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button
                className="w-full"
                disabled={isPending || !status}
                onClick={() => updatePaymentStatus({ id, status })}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Status"
                )}
              </Button>
            </div>
          </div>

          <div className="pt-4 text-center">
            <Button
              variant="ghost"
              className="text-sm text-muted-foreground"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full-Screen Image Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="p-0 bg-transparent border-none max-w-full max-h-full">
          <div className="relative w-full h-full flex items-center justify-center bg-black/90">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 text-white"
              onClick={() => setPreviewOpen(false)}
            >
              <X className="w-6 h-6" />
            </Button>
            <img
              src={image}
              alt="Full Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-md"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
