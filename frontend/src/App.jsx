import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
// import Collection from "./pages/Collection/Collection";
import Alltoys from "./pages/Alltoys/Alltoys";
import Pdp from "./pages/Pdp/Pdp";
// import Product from "./pages/Product/Product";
import Footer from "./components/Footer/Footer";
import Checkout from "./pages/Checkout/Checkout";
import Order from "./pages/Order/Order";
import Collection from "./pages/Collection/Collection";
import Product from "./pages/Product/Product";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Checkout" element={<Checkout />} />
        <Route path="/Alltoys" element={<Alltoys />} />
        <Route path="/Order" element={<Order />} />
        <Route path="/About" element={<About />} />
        <Route path="/Collection" element={<Collection />} />
        <Route path="/Product" element={<Product />} />
        <Route path="/Pdp/:id" element={<Pdp />} />
      </Routes>

      {/* <Footer /> */}
    </>
  );
}

export default App;