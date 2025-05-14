import { Hero } from "@/components/landing/Hero";
import { NavBar } from "@/components/landing/NavBar";
import React from "react";

export default function LandingPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <NavBar />
      <Hero />
    </div>
  );
}
