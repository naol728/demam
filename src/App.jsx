import { BrowserRouter, Route, Routes } from "react-router";
import Signup from "./pages/public/Signup";
import LandingPage from "./pages/public/LandingPage";
import Signin from "./pages/public/Signin";
import Protectedroute from "./layout/Protectedroute";
import Products from "./pages/merchant/Products";
import Orders from "./pages/merchant/Orders";
import Cart from "./pages/merchant/Cart";
import Profile from "./pages/merchant/Profile";
import MainLayout from "./layout/MainLayout";
import { useDispatch } from "react-redux";
import { fetchUser } from "./store/user/userslice";
import { useEffect } from "react";
import SellerLayout from "./layout/SellerLayout";
import SellerProducts from "./pages/seller/SellerProducts";
import SellerOrders from "./pages/seller/SellerOrders";
import SellerStats from "./pages/seller/SellerStats";
import SellerProfile from "./pages/seller/SellerProfile";
import SellerProductAdd from "./pages/seller/SellerProductAdd";
import SellerProductLayout from "./layout/SellerProductLayout";
import SellerOrderDetail from "./pages/seller/SellerOrderDetail";
import BuyerLayout from "./layout/BuyerLayout";
import OrderDetail from "./pages/merchant/OrderDetail";

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
          <Route element={<BuyerLayout />}>
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/carts" element={<Cart />} />
            <Route path="/profile" element={<SellerProfile />} />
          </Route>
        </Route>

        {/* Seller protected routes */}
        <Route element={<Protectedroute role="seller" />}>
          <Route path="/dashboard" element={<SellerLayout />}>
            <Route path="product/new" element={<SellerProductAdd />} />
            <Route path="products" element={<SellerProductLayout />}>
              <Route index element={<SellerProducts />} />
            </Route>
            <Route path="orders">
              <Route index element={<SellerOrders />} />
              <Route path=":id" element={<SellerOrderDetail />} />
            </Route>

            <Route path="stats" element={<SellerStats />} />
            <Route path="profile" element={<SellerProfile />} />
          </Route>
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
