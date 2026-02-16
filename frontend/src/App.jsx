import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
// import Collection from "./pages/Collection";
import Alltoys from "./pages/Alltoys";
import Pdp from "./pages/Pdp";
// import Product from "./pages/Product";
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