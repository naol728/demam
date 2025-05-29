import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { updatepayment } from "@/services/payment";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function UpdatePaymentStatusDialog({
  open,
  onOpenChange,
  paymentId,
  method,
  amount,
  id,
}) {
  const [paymentMethod, setPaymentMethod] = useState(method);
  const [paymentAmount, setPaymentAmount] = useState(amount);
  const [file, setFile] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: updatepaymentinfo, isPending } = useMutation({
    mutationFn: updatepayment,
    mutationKey: ["updatePaymentStatus", paymentId],
    onSuccess: () => {
      queryClient.invalidateQueries(["payment_info", paymentId]);
      toast({
        title: "Success",
        description: "Payment status updated successfully.",
      });
      onOpenChange(false);
    },
    onError: (err) => {
      console.log(err);
      toast({
        title: "Error",
        description: err?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });
  const handleupdate = () => {
    updatepaymentinfo({
      id,
      payment_method: paymentMethod,
      amount: paymentAmount,
      file,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Payment </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Payment Method</Label>
            <Input
              placeholder="e.g. Bank Transfer"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              placeholder="e.g. 500"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div>
            <Label>Payment Receipt Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              disabled={isPending}
            />
          </div>
        </div>
        <DialogFooter className="pt-4">
          <Button
            onClick={handleupdate}
            disabled={!paymentMethod || !paymentAmount || isPending}
          >
            {isPending ? "Updating..." : "Update Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
