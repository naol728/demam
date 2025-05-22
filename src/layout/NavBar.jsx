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

  const { data: carts } = useQuery({
    queryFn: () => getallcartstobuyer(),
    queryKey: ["carts_item"],
  });
  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrderstoBuyer(),
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlesignout = async () => {
    await signOut();
    dispatch(clearUser());
    navigate("/");
  };

  // Utility for active class
  const isActive = (path) =>
    location.pathname === path
      ? "text-primary font-bold border-b-2 border-primary"
      : "text-gray-600 hover:text-primary transition";

  return (
    <nav className="shadow-md px-4 py-3 w-full fixed bg-background/90 backdrop-blur-md z-50 border-b border-border-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-xl text-primary"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd size={20} />
          </div>
          Demam Platform
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-10 text-base">
          <Link
            to="/products"
            className={`flex items-center gap-2 ${isActive("/products")}`}
          >
            <ShoppingBag size={20} />
            Products
          </Link>

          <Link
            to="/carts"
            className={`flex items-center gap-2 relative ${isActive("/carts")}`}
          >
            <ShoppingCart size={20} />
            <Badge
              className="absolute -top-2 -right-3 px-1.5 py-0 text-xs rounded-full"
              variant="secondary"
            >
              {carts?.length ?? 0}
            </Badge>
            Cart
          </Link>

          <Link
            to="/orders"
            className={`flex items-center gap-2 ${isActive("/orders")}`}
          >
            <ArrowUpFromLine size={20} />
            <Badge
              className="absolute -top-2 -right-3 px-1.5 py-0 text-xs rounded-full"
              variant="secondary"
            >
              {orders?.length ?? 0}
            </Badge>
            Orders
          </Link>
        </div>

        {/* Avatar & Mobile Menu */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <div className="uppercase font-bold hidden md:block mr-2 select-none">
              👋 {user?.name.split(" ")[0]}
            </div>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer ring-2 ring-primary ring-offset-2 ring-offset-white">
                <AvatarImage src={user?.profileimg} alt="User" />
                <AvatarFallback>NA</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem>
                <Link to="/profile" className="w-full flex gap-2 items-center">
                  <CircleUser />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handlesignout}
                className="flex items-center gap-2"
              >
                <LogOut />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Links */}
      {menuOpen && (
        <div className="md:hidden mt-3 space-y-3 bg-white border-t border-gray-200 py-4 shadow-lg rounded-b-md z-50">
          <Link
            to="/products"
            className={`block px-4 py-2 text-center rounded-md ${isActive("/products")}`}
            onClick={() => setMenuOpen(false)}
          >
            Products
          </Link>

          <Link
            to="/carts"
            className={`flex justify-center items-center gap-2 relative px-4 py-2 rounded-md ${isActive("/carts")}`}
            onClick={() => setMenuOpen(false)}
          >
            <ShoppingCart size={20} />
            <Badge
              className="absolute -top-2 -right-3 px-1.5 py-0 text-xs rounded-full"
              variant="secondary"
            >
              {carts?.length ?? 0}
            </Badge>
            Cart
          </Link>

          <Link
            to="/orders"
            className={`flex justify-center items-center gap-2 px-4 py-2 rounded-md ${isActive("/orders")}`}
            onClick={() => setMenuOpen(false)}
          >
            <ArrowUpFromLine size={20} />
            <Badge
              className="absolute -top-2 -right-3 px-1.5 py-0 text-xs rounded-full"
              variant="secondary"
            >
              {orders?.length ?? 0}
            </Badge>
            Orders
          </Link>
        </div>
      )}
    </nav>
  );
}
