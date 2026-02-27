import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Alltoys from "./pages/Alltoys/Alltoys";
import Pdp from "./pages/Pdp/Pdp";
import Checkout from "./pages/Checkout/Checkout";
import Order from "./pages/Order/Order";
import Collection from "./pages/Collection/Collection";
import Product from "./pages/Product/Product";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminGuard from "./pages/Admin/AdminGuard";
import Dashboard from "./pages/Admin/Dashboard";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminCustomers from "./pages/Admin/AdminCustomers";

function AppContent() {
  const location = useLocation();

  // Check if current route starts with /admin
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <main style={{ marginTop: !isAdminRoute ? "140px" : "0" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Checkout" element={<Checkout />} />
          <Route path="/Alltoys" element={<Alltoys />} />
          <Route path="/Order" element={<Order />} />
          <Route path="/About" element={<About />} />
          <Route path="/Collection" element={<Collection />} />
          <Route path="/Product" element={<Product />} />
          <Route path="/Pdp/:id" element={<Pdp />} />

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminLayout />
              </AdminGuard>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
          </Route>
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;