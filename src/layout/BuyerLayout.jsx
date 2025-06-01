import React from "react";
import { Outlet } from "react-router";
import NavBar from "./NavBar";
import { Toaster } from "@/components/ui/toaster";

export default function BuyerLayout() {
  return (
    <>
      <header>
        <NavBar />
      </header>
      <main className="pt-16 ">
        <Outlet />
        <Toaster />
      </main>
    </>
  );
}
