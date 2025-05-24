import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
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
  const naviagate = useNavigate();
  const dispatch = useDispatch();

  const handlesignout = async () => {
    await signOut();
    dispatch(clearUser());
    naviagate("/");
  };

  if (loading)
    return (
      <div className="h-dvh">
        <Loading />
      </div>
    );

  return (
    <Sidebar className="h-screen border-r bg-background">
      <SidebarHeader />

      <div className="text-xl font-bold text-center ">
        <Link to="/" className="flex items-center gap-2 font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <span>Demam Platform</span>
        </Link>
      </div>

      <SidebarContent>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map(({ title, url, icon: Icon }) => {
            const isActive = location.pathname.startsWith(url);

            return (
              <Link
                key={title}
                to={url}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all",
                  {
                    "bg-primary/80 text-foreground font-semibold": isActive,
                    "hover:bg-muted/70 text-muted-foreground": !isActive,
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

      <SidebarFooter className="px-4 py-3 border-t">
        <Collapsible>
          <CollapsibleTrigger className="w-full flex items-center justify-between gap-3 p-2 rounded-md transition hover:bg-muted">
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9">
                <AvatarImage src={user.profileimg} />
                <AvatarFallback>{user.name?.[0] ?? "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:bg-destructive/10 hover:text-red-600"
              onClick={handlesignout}
            >
              Logout
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </SidebarFooter>
    </Sidebar>
  );
}
