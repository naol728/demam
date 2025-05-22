import {
  Book,
  GalleryVerticalEnd,
  Menu,
  Sunset,
  Trees,
  Zap,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { signOut } from "@/services/auth";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "@/store/user/userslice";

const NavBar = ({
  logo = { url: "/", src: "logo.jpg", alt: "logo", title: "Demam Platform" },
  menu = [
    { title: "Home", url: "/" },
    { title: "Featured", url: "/#Featured" },
    { title: "Products", url: "/#Products" },
    { title: "Testemonial", url: "/#Testemonial" },
  ],
  auth = {
    login: { title: "Sign in", url: "/signin" },
    signup: { title: "Sign up", url: "/signup" },
  },
}) => {
  const location = useLocation(); // get current path
  const { user, role, loading } = useSelector((state) => state.user);

  return (
    <section className="">
      <div className="container shadow-md py-3 px-2 fixed w-full bg-background/90 backdrop-blur-md z-50 border-b border-border-200">
        {/* Desktop Menu */}
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 font-medium">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              Demam Platform
            </Link>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map(
                    (item) => renderMenuItem(item, location.pathname) // pass current path
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Right Buttons */}
          <div className="flex gap-2">
            {!loading &&
              (role ? (
                <Button asChild size="sm">
                  {role === "seller" ? (
                    <Link to="/dashboard/products">Dashboard</Link>
                  ) : (
                    <Link to="/products">Shop Now</Link>
                  )}
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm">
                    <Link to={auth.login.url}>{auth.login.title}</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link to={auth.signup.url}>{auth.signup.title}</Link>
                  </Button>
                </>
              ))}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-medium">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              Demam Platform
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link to={logo.url} className="flex items-center gap-2">
                      <GalleryVerticalEnd className="size-4" />
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map(
                      (item) => renderMobileMenuItem(item, location.pathname) // pass current path
                    )}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    {!loading &&
                      (role ? (
                        <Button asChild size="sm">
                          {role === "seller" ? (
                            <Link to="/dashboard/products">Dashboard</Link>
                          ) : (
                            <Link to="/products">Shop Now</Link>
                          )}
                        </Button>
                      ) : (
                        <>
                          <Button asChild variant="outline" size="sm">
                            <Link to={auth.login.url}>{auth.login.title}</Link>
                          </Button>
                          <Button asChild size="sm">
                            <Link to={auth.signup.url}>
                              {auth.signup.title}
                            </Link>
                          </Button>
                        </>
                      ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

// Add active class conditionally
const renderMenuItem = (item, currentPath) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  // Check if currentPath matches item.url
  const isActive = currentPath === item.url;

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground ${
          isActive ? "border-b-2 border-primary font-bold text-primary" : ""
        }`}
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item, currentPath) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  // Active check for mobile menu links
  const isActive = currentPath === item.url;

  return (
    <Link
      key={item.title}
      to={item.url}
      className={`text-md font-semibold block py-2 ${
        isActive ? "border-l-4 border-primary pl-3 text-primary font-bold" : ""
      }`}
    >
      {item.title}
    </Link>
  );
};

export { NavBar };
