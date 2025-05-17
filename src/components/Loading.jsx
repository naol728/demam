import { Loader } from "lucide-react";
import React from "react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <Loader className="size-8" />
    </div>
  );
}
