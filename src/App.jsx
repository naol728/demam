import { BrowserRouter, Route, Routes } from "react-router";
import Signup from "./pages/Signup";
import LandingPage from "./pages/LandingPage";
import Signin from "./pages/Signin";
import Protectedroute from "./layout/Protectedroute";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import MainLayout from "./layout/MainLayout";
import { useDispatch } from "react-redux";
import { fetchUser } from "./store/user/userslice";
import { useEffect } from "react";

// Seller pages (placeholder JSX can be replaced later)
const SellerProducts = () => <>Seller's Products</>;
const SellerOrders = () => <>Seller's Orders</>;
const SellerStats = () => <>Seller's Stats</>;
const SellerProfile = () => <>Seller's Profile</>;

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes inside main layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Merchant protected routes */}
        <Route element={<Protectedroute role="merchant" />}>
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Seller protected routes */}
        <Route element={<Protectedroute role="seller" />}>
          <Route path="/dashboard/products" element={<SellerProducts />} />
          <Route path="/dashboard/orders" element={<SellerOrders />} />
          <Route path="/dashboard/stats" element={<SellerStats />} />
          <Route path="/dashboard/profile" element={<SellerProfile />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
