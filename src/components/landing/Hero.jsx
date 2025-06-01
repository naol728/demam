import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useSelector } from "react-redux";

const Hero = () => {
  const { user, role, loading } = useSelector((state) => state.user);

  return (
    <section
      id="Home"
      className="py-12 bg-gradient-to-br from-background/50 to-background"
    >
      <div className="container mx-auto px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
              Connecting Buyers and Sellers
            </p>
            <h1 className="mb-6 max-w-xl text-4xl font-extrabold leading-tight text-forground sm:text-5xl lg:text-6xl">
              Welcome to Demam Platform
            </h1>
            <p className="mb-10 max-w-lg text-lg text-muted-foreground sm:text-xl">
              Demam is your ultimate shopping platform, bridging the gap between
              Buyers and sellers. Explore a seamless way to connect, trade, and
              grow your business.
            </p>
            <div className="flex w-full max-w-xs flex-col gap-4 sm:max-w-none sm:flex-row sm:justify-start">
              {loading ? null : role ? (
                <Button asChild size="lg" className="w-full sm:w-auto">
                  {role === "seller" ? (
                    <Link to="/dashboard/products">Go to Dashboard</Link>
                  ) : (
                    <Link to="/products">Shop Now</Link>
                  )}
                </Button>
              ) : (
                <Link to="/signin" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    Get Started
                    <ArrowRight className="size-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="relative h-80 w-full overflow-hidden rounded-lg shadow-lg sm:h-[28rem] lg:h-[32rem]">
            <img
              src="https://i.pinimg.com/736x/9b/e1/5f/9be15f8148f10ace49165c2dcf370a75.jpg"
              alt="Demam platform hero"
              className="h-full w-full object-cover object-center"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero };
