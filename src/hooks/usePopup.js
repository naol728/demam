// usePopup.js or usePopup.ts
import { setOpen as setOpenAction } from "@/store/popup";
import { useDispatch, useSelector } from "react-redux";

export function usePopup() {
  const { open } = useSelector((state) => state.popup);
  const dispatch = useDispatch();

  const setOpen = (value) => {
    dispatch(setOpenAction(value)); // now this refers to the correct Redux action
  };

  return { open, setOpen };
}
