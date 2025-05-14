import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const data = [
  {
    id: "modern-storefronts",
    title: "Modern Storefronts",
    description:
      "Create stunning, mobile-friendly storefronts that attract buyers and boost your online presence with ease.",
    href: "/",
    image:
      "https://i.pinimg.com/736x/4d/9e/83/4d9e8336c870bdad6531ea2aa3729a7c.jpg",
  },
  {
    id: "customization",
    title: "Easy Product Customization",
    description:
      "Easily manage your products, pricing, and inventory to match your brand and maximize sales.",
    href: "/",
    image:
      "https://i.pinimg.com/736x/ff/f9/84/fff9840211cf4202b76c8bad51bf8db7.jpg",
  },
  {
    id: "performance",
    title: "Fast & Reliable Experience",
    description:
      "Lightning-fast browsing and seamless shopping ensure a smooth experience for your customers.",
    href: "/",
    image:
      "https://i.pinimg.com/736x/11/75/67/1175675b1bfb3fd9d5502b18794b7037.jpg",
  },
  {
    id: "dashboard",
    title: "Powerful Seller Dashboard",
    description:
      "Track sales, manage orders, and analyze performance with an intuitive dashboard built for growth.",
    href: "/",
    image:
      "https://i.pinimg.com/736x/1e/25/b9/1e25b9f80987315de11ba1b2fe8912f9.jpg",
  },
  {
    id: "scalability",
    title: "Grow Without Limits",
    description:
      "Whether you’re a small business or a growing brand, Demam scales with you every step of the way.",
    href: "/",
    image:
      "https://i.pinimg.com/736x/f3/3a/3c/f33a3cf8893eeebf86ff43308857aeb5.jpg",
  },
];

const Gallery = ({
  title = "Explore Demam",
  description = "Welcome to Demam's gallery! Discover how modern web technologies are shaping exceptional digital experiences. These case studies highlight real-world applications and success stories.",
  items = data,
}) => {
  const [carouselApi, setCarouselApi] = useState();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  return (
    <section className="py-32">
      <div className="container">
        <div className="mb-8 flex items-end justify-between md:mb-14 lg:mb-16">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-medium md:text-4xl lg:text-5xl">
              {title}
            </h2>
            <p className="max-w-lg text-muted-foreground">{description}</p>
          </div>
          <div className="hidden shrink-0 gap-2 md:flex">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollPrev();
              }}
              disabled={!canScrollPrev}
              className="disabled:pointer-events-auto"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollNext();
              }}
              disabled={!canScrollNext}
              className="disabled:pointer-events-auto"
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              "(max-width: 768px)": {
                dragFree: true,
              },
            },
          }}
        >
          <CarouselContent className="ml-0 2xl:mr-[max(0rem,calc(50vw-700px))] 2xl:ml-[max(8rem,calc(50vw-700px))]">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="max-w-[320px] pl-[20px] lg:max-w-[360px]"
              >
                <a href={item.href} className="group rounded-xl">
                  <div className="group relative h-full min-h-[27rem] max-w-full overflow-hidden rounded-xl md:aspect-[5/4] lg:aspect-[16/9]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 h-full bg-[linear-gradient(transparent_20%,var(--primary)_100%)] mix-blend-multiply" />
                    <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-6 text-white md:p-8">
                      <div className="mb-2 pt-4 text-xl font-semibold md:mb-3 md:pt-4 lg:pt-4">
                        {item.title}
                      </div>
                      <div className="mb-8 line-clamp-2 md:mb-12 lg:mb-9">
                        {item.description}
                      </div>
                      {/* <div className="flex items-center text-sm">
                        Read more{" "}
                        <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                      </div> */}
                    </div>
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="mt-8 flex justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                currentSlide === index ? "bg-primary" : "bg-primary/20"
              }`}
              onClick={() => carouselApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { Gallery };
