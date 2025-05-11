import { BrowserRouter, Route, Routes } from "react-router";
import Signup from "./pages/Signup";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<>this is signin page </>} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
