import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const Testimonial = () => {
  return (
    <section id="Testimonial" className="py-32">
      <div className="container">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 items-stretch gap-x-0 gap-y-4 lg:grid-cols-3 lg:gap-4">
            <img
              src="https://uploads-garowe.s3.amazonaws.com/upload/images/Article/2023/1690730315/main/thumbnail.jpg"
              alt="testimonial"
              className="h-72 w-full rounded-md object-cover lg:h-auto"
            />
            <Card className="col-span-2 flex items-center justify-center p-6">
              <div className="flex flex-col gap-4">
                <q className="text-xl font-medium lg:text-3xl">
                  Demam helped me grow my small business into a full-fledged
                  online store. Managing inventory and sales is now effortless.
                </q>
                <div className="flex flex-col items-start">
                  <p>shek alhamudein</p>
                  <p className="text-muted-foreground">Owner, Medroc owner</p>
                </div>
              </div>
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card>
              <CardContent className="px-6 pt-6 leading-7 text-foreground/70">
                <q>
                  The onboarding process was super smooth. I listed my products
                  within minutes and started receiving orders the same week!
                </q>
              </CardContent>
              <CardFooter>
                <div className="flex gap-4 leading-5">
                  <Avatar className="size-9 rounded-full ring-1 ring-input">
                    <AvatarImage
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt="Tigist H."
                    />
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">Tigist Hailemariam</p>
                    <p className="text-muted-foreground">Local Seller</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
            <Card>
              <CardContent className="px-6 pt-6 leading-7 text-foreground/70">
                <q>
                  Demam’s analytics tools gave me insights I never had before.
                  It’s like having a full-time business analyst in my pocket.
                </q>
              </CardContent>
              <CardFooter>
                <div className="flex gap-4 leading-5">
                  <Avatar className="size-9 rounded-full ring-1 ring-input">
                    <AvatarImage
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM9OyOozyB9Wr5lJPnUiQK_oOcv11NN-LssQ&s"
                      alt="Samuel"
                    />
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">Samuel Bekele</p>
                    <p className="text-muted-foreground">
                      Tech Accessories Seller
                    </p>
                  </div>
                </div>
              </CardFooter>
            </Card>
            <Card>
              <CardContent className="px-6 pt-6 leading-7 text-foreground/70">
                <q>
                  With Demam, I’ve reached customers far beyond my local market.
                  Their platform is a game changer for Ethiopian entrepreneurs.
                </q>
              </CardContent>
              <CardFooter>
                <div className="flex gap-4 leading-5">
                  <Avatar className="size-9 rounded-full ring-1 ring-input">
                    <AvatarImage
                      src="https://randomuser.me/api/portraits/men/55.jpg"
                      alt="Mulugeta"
                    />
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">Mulugeta Tadesse</p>
                    <p className="text-muted-foreground">Merchant Partner</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Testimonial };
