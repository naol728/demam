import React from "react";
import { Outlet } from "react-router";

export default function SellerProductLayout() {
  return (
    <>
     <div className="min-h-dvh mt-10">
      <Outlet />
        </div>
    </>
  );
}
