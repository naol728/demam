import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useSelector } from "react-redux";

const Hero = () => {
  const { user, role, loading } = useSelector((state) => state.user);

  return (
    <section className="py-4">
      <div className="container">
        <div className="grid items-center gap-8 bg-muted-2 lg:grid-cols-2">
          <div className="flex flex-col items-center p-16 text-center lg:items-start lg:text-left">
            <p>Connecting Merchants and Sellers</p>
            <h1 className="my-6 text-4xl font-bold text-pretty lg:text-6xl">
              Welcome to Demam Platform
            </h1>
            <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">
              Demam is your ultimate shopping platform, bridging the gap between
              merchants and sellers. Explore a seamless way to connect, trade,
              and grow your business.
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              {loading ? null : role ? (
                <>
                  <Button asChild size="sm">
                    {role === "seller" ? ( // ✅ check for "seller"
                      <Link to="/dashboard/products">Dashboard</Link>
                    ) : (
                      <Link to="/products">Shop Now</Link>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/signin">
                    <Button>
                      Get Started
                      <ArrowRight className="size-4" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          <img
            src="https://cdn.shopify.com/s/files/1/0070/7032/articles/ecommerce_d08806b6-6f5e-4a94-a79f-7eb96b46c547.jpg?v=1743403590"
            alt="Demam platform hero"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export { Hero };
