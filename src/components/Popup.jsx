import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setOpen } from "@/store/popup";

export function Popup({ children, title }) {
  const { open } = useSelector((state) => state.popup);
  const dispatch = useDispatch();

  if (!open) return null; // properly short-circuit rendering

  return (
    <Dialog open={open} onOpenChange={(value) => dispatch(setOpen(value))}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => dispatch(setOpen(false))}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
