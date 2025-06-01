import { Link, useNavigate, useLocation } from "react-router";
import { useState } from "react";
import {
  ArrowUpFromLine,
  CircleUser,
  GalleryVerticalEnd,
  LogOut,
  Menu,
  ShoppingBag,
  ShoppingCart,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "@/services/auth";
import { clearUser } from "@/store/user/userslice";
import { useQuery } from "@tanstack/react-query";
import { getallcartstobuyer } from "@/services/cart";
import { Badge } from "@/components/ui/badge";
import { getOrderstoBuyer } from "@/services/orders";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: carts } = useQuery({
    queryFn: getallcartstobuyer,
    queryKey: ["carts_item"],
  });

  const { data: orders } = useQuery({
    queryFn: getOrderstoBuyer,
    queryKey: ["orders"],
  });

  const handleSignOut = async () => {
    await signOut();
    dispatch(clearUser());
    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-primary font-semibold border-b-2 border-primary"
      : "text-muted-foreground hover:text-primary";

  return (
    <nav className="fixed top-0 left-0 w-full bg-background/90 backdrop-blur-md border-b z-50 shadow-sm px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-xl text-primary"
        >
          <div className="h-8 w-8 flex items-center justify-center bg-primary text-white rounded-md">
            <GalleryVerticalEnd size={20} />
          </div>
          Demam
        </Link>

        <div className="hidden md:flex items-center gap-8 text-base">
          <Link
            to="/products"
            className={`flex items-center gap-1 ${isActive("/products")}`}
          >
            <ShoppingBag size={18} /> Products
          </Link>

          <Link
            to="/carts"
            className={`relative flex items-center gap-1 ${isActive("/carts")}`}
          >
            <ShoppingCart size={18} />
            Cart
            {carts?.length > 0 && (
              <Badge className="absolute -top-2 -right-3 px-1 py-0.5 text-xs">
                {carts.length}
              </Badge>
            )}
          </Link>

          <Link
            to="/orders"
            className={`relative flex items-center gap-1 ${isActive("/orders")}`}
          >
            <ArrowUpFromLine size={18} />
            Orders
            {orders?.length > 0 && (
              <Badge className="absolute -top-2 -right-3 px-1 py-0.5 text-xs">
                {orders.length}
              </Badge>
            )}
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar className="ring-2 ring-primary">
                  <AvatarImage src={user?.profileimg} alt="user" />
                  <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <span className="hidden md:block font-medium text-sm uppercase">
                  👋 {user?.name?.split(" ")[0]}
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-2 w-full">
                  <CircleUser size={16} />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSignOut}
                className="flex items-center gap-2 text-destructive"
              >
                <LogOut size={16} />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            size="icon"
            variant="ghost"
            className="md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-3 space-y-2 py-4 px-4 bg-white border-t rounded-b-md shadow-lg">
          <Link
            to="/products"
            onClick={() => setMenuOpen(false)}
            className={isActive("/products")}
          >
            <div className="flex items-center gap-2 py-2">
              <ShoppingBag size={18} />
              Products
            </div>
          </Link>

          <Link
            to="/carts"
            onClick={() => setMenuOpen(false)}
            className={isActive("/carts")}
          >
            <div className="flex items-center gap-2 relative py-2">
              <ShoppingCart size={18} />
              Cart
              {carts?.length > 0 && (
                <Badge className="absolute top-1 right-4 px-1 py-0.5 text-xs">
                  {carts.length}
                </Badge>
              )}
            </div>
          </Link>

          <Link
            to="/orders"
            onClick={() => setMenuOpen(false)}
            className={isActive("/orders")}
          >
            <div className="flex items-center gap-2 relative py-2">
              <ArrowUpFromLine size={18} />
              Orders
              {orders?.length > 0 && (
                <Badge className="absolute top-1 right-4 px-1 py-0.5 text-xs">
                  {orders.length}
                </Badge>
              )}
            </div>
          </Link>
        </div>
      )}
    </nav>
  );
}
