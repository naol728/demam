import React from "react";
import { Outlet } from "react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";

export default function SellerProductsLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full " >
        <SidebarTrigger />
        <Outlet />
        <Toaster />
      </main>
    </SidebarProvider>
  );
}
