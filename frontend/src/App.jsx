import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Collection from "./pages/Collection";
import Product from "./pages/Product";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/product" element={<Product />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;