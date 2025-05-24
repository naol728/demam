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
    if (!carouselApi) return;

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
    <section className="py-24 bg-gradient-to-b from-background/50 to-background">
      <div className="container mx-auto px-6">
        <div className="mb-12 flex flex-col-reverse items-center justify-between gap-6 md:flex-row md:mb-16">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-forground sm:text-5xl">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground">{description}</p>
          </div>
          <div className="flex gap-3">
            <Button
              size="icon"
              variant="outline"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="disabled:opacity-50"
              aria-label="Previous slide"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext}
              className="disabled:opacity-50"
              aria-label="Next slide"
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>

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
                className="max-w-[320px] pl-5 lg:max-w-[360px]"
              >
                <a
                  href={item.href}
                  className="group block rounded-xl shadow-lg transition-shadow hover:shadow-2xl"
                >
                  <div className="relative min-h-[27rem] overflow-hidden rounded-xl md:aspect-[5/4] lg:aspect-[16/9]">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent mix-blend-multiply" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
                      <h3 className="mb-2 text-xl font-semibold">
                        {item.title}
                      </h3>
                      <p className="line-clamp-2 text-sm md:text-base">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-8 flex justify-center gap-3">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => carouselApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-3 w-3 rounded-full transition-colors ${
                currentSlide === index ? "bg-primary" : "bg-primary/30"
              } hover:bg-primary`}
              type="button"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { Gallery };
