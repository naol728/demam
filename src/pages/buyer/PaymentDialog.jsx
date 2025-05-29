import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import { addPayment } from "@/services/payment";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function PaymentDialog({ orderItemId, open, onOpenChange }) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [file, setFile] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: uploadPaymentInfo, isPending: uploading } = useMutation({
    mutationFn: addPayment,
    mutationKey: ["uploadPaymentInfo"],
    onSuccess: () => {
      queryClient.invalidateQueries([
        "payment_info",
        "order_detail",
        orderItemId,
      ]);
      toast({
        title: "Sucess",
        description:
          "Payment information uploaded successfully. Please wait for confirmation.",
      });
      onOpenChange(false);
    },
    onError: (err) => {
      toast({
        title: "Error",
        description:
          err?.message || "An unexpected error occurred during sign in.",
        variant: "destructive",
      });
    },
  });

  const handlepayment = () => {
    uploadPaymentInfo({
      order_id: orderItemId,
      payment_method: paymentMethod,
      amount: parseFloat(paymentAmount),
      file,
    });
    setPaymentMethod("");
    setPaymentAmount("");
    setFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Payment Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Payment Method</Label>
            <Input
              placeholder="e.g. Bank Transfer"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled={uploading}
            />
          </div>
          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              placeholder="e.g. 500"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              disabled={uploading}
            />
          </div>
          <div>
            <Label>Payment Receipt Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              disabled={uploading}
            />
          </div>
        </div>
        <DialogFooter className="pt-4">
          <Button
            onClick={handlepayment}
            disabled={!file || !paymentMethod || !paymentAmount || uploading}
          >
            {uploading ? "Uploading..." : "Save Payment Info"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
