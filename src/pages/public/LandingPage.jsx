import { Hero } from "@/components/landing/Hero";
import { Gallery } from "@/components/landing/Gallery";
import { Stat } from "@/components/landing/Stat";
import { Testimonial } from "@/components/landing/Testimonial";
import { Footer } from "@/components/landing/Footer";
import { NavBar } from "@/components/landing/NavBar";
import React from "react";
import LandingProducts from "@/components/landing/LandingProducts";

export default function LandingPage() {
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <NavBar />
      </div>

      <div className="max-w-6xl mx-auto pt-10">
        <Hero />
        <Gallery />
        <LandingProducts />
        <Stat />
        <Testimonial />
        <Footer />
      </div>
    </div>
  );
}
