import { Toaster } from "@/components/ui/toaster";
import React from "react";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}
