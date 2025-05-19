import { Link } from "react-router";
import { useState } from "react";
import {
  ArrowUpFromLine,
  CircleUser,
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
import { useSelector } from "react-redux";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.user);

  return (
    <nav className=" shadow-md px-4 py-1 w-full fixed bg-background/80 ">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="logo.jpg" className="max-h-16 w-14" alt="Logo" />
          <div className="text-xl font-semibold tracking-tight ">Demam</div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 text-base font-base">
          <Link to="/products" className="flex justify-center gap-2">
            <ShoppingBag size={20} /> Products
          </Link>
          <Link to="/carts" className="flex justify-center gap-2">
            <ShoppingCart size={20} /> Cart
          </Link>
          <Link to="/orders" className="flex justify-center gap-2">
            <ArrowUpFromLine size={20} /> Orders
          </Link>
        </div>

        {/* Avatar */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <div className="uppercase font-bold">
              👋{user?.name.split(" ")[0]}
            </div>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={user?.profileimg} alt="User" />
                <AvatarFallback>NA</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem>
                <Link to="/profile" className="w-full flex gap-2 items-center ">
                  <CircleUser />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  // Handle logout
                  console.log("Logging out...");
                }}
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
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Links */}
      {menuOpen && (
        <div className="md:hidden mt-2 space-y-2 text-center">
          <Link to="/products" className="block text-base py-2 ">
            Products
          </Link>
          <Link to="/cart" className="block text-base py-2 ">
            Cart
          </Link>
          <Link to="/orders" className="block text-base py-2 ">
            Orders
          </Link>
        </div>
      )}
    </nav>
  );
}
