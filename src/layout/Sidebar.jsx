import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Package,
  ShoppingCart,
  User,
  BarChart3,
  ChevronDown,
  GalleryVerticalEnd,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Loading from "@/components/Loading";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { signOut } from "@/services/auth";
import { clearUser } from "@/store/user/userslice";

const navItems = [
  { title: "Products", url: "/dashboard/products", icon: Package },
  { title: "Add Product", url: "/dashboard/product/new", icon: Package },
  { title: "Orders", url: "/dashboard/orders", icon: ShoppingCart },
  { title: "Stats", url: "/dashboard/stats", icon: BarChart3 },
  { title: "Profile", url: "/dashboard/profile", icon: User },
];

export function AppSidebar() {
  const { user, role, loading } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    await signOut();
    dispatch(clearUser());
    navigate("/");
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );

  return (
    <Sidebar className="h-screen border-r bg-background shadow-md">
      <SidebarHeader className="p-4 border-b">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow">
            <GalleryVerticalEnd className="w-4 h-4" />
          </div>
          <span>Demam Platform</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <nav className="flex flex-col gap-1 px-4">
          {navItems.map(({ title, url, icon: Icon }) => {
            const isActive = location.pathname.startsWith(url);
            return (
              <Link
                key={title}
                to={url}
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  {
                    "bg-primary text-white shadow-sm": isActive,
                    "text-muted-foreground hover:bg-muted/70": !isActive,
                  }
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{title}</span>
              </Link>
            );
          })}
        </nav>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <Collapsible>
          <CollapsibleTrigger className="w-full flex items-center justify-between gap-3 rounded-md p-2 hover:bg-muted transition">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.profileimg} />
                <AvatarFallback>{user.name?.[0] ?? "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleSignOut}
            >
              Logout
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </SidebarFooter>
    </Sidebar>
  );
}
