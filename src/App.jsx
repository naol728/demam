import { BrowserRouter, Route, Routes } from "react-router";
import Signup from "./pages/Signup";
import LandingPage from "./pages/LandingPage";
import Signin from "./pages/Signin";
import Protectedroute from "./layout/Protectedroute";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import MainLayout from "./layout/MainLayout";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<Protectedroute role="merchant" />}>
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route element={<Protectedroute role="seller" />}>
            <Route
              path="/products"
              element={<>seller seeing products page</>}
            />
            <Route
              path="/myorders"
              element={<>seller seeing products page</>}
            />
            <Route
              path="/mystatics"
              element={<>seller seeing products page</>}
            />
            <Route
              path="/myprofile"
              element={<>seller seeing products page</>}
            />
          </Route>
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
