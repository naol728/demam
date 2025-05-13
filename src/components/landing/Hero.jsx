import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const Hero = () => {
  return (
    <section className="py-4">
      <div className="container">
        <div className="grid items-center gap-8 bg-muted-2 lg:grid-cols-2">
          <div className="flex flex-col items-center p-16 text-center lg:items-start lg:text-left">
            <p>Demam products</p>
            <h1 className="my-6 text-4xl font-bold text-pretty lg:text-6xl">
              Welcome to Demam Platform
            </h1>
            <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig
              doloremque mollitia fugiat omnis! Porro facilis quo animi
              consequatur. Explicabo.
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              <Link to="/signin">
                <Button>
                  Shop Now
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
          <img
            src="https://cdn.shopify.com/s/files/1/0070/7032/articles/ecommerce_d08806b6-6f5e-4a94-a79f-7eb96b46c547.jpg?v=1743403590"
            alt="placeholder hero"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export { Hero };
