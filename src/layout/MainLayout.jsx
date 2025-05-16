import { Toaster } from "@/components/ui/toaster";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router";

export default function MainLayout() {
  const { user } = useSelector((state) => state.user);

  useEffect(() => {}, [user]);

  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}
