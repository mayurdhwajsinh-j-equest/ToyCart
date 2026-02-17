import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
// import Collection from "./pages/Collection/Collection";
import Alltoys from "./pages/Alltoys/Alltoys";
import Pdp from "./pages/Pdp/Pdp";
// import Product from "./pages/Product/Product";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/Alltoys" element={<Alltoys />} />
        <Route path="/Pdp" element={<Pdp />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;