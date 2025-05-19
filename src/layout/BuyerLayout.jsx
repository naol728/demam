import React from "react";
import { Outlet } from "react-router";
import NavBar from "./NavBar";
import { Toaster } from "@/components/ui/toaster";

export default function BuyerLayout() {
  return (
    <div>
      <header>
        <NavBar />
      </header>
      <main className="pt-20">
        <Outlet />
        <Toaster />
      </main>
    </div>
  );
}
