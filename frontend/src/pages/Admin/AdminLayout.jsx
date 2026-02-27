import { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import "./Admin.css";

const navItems = [
  { path: "/admin/dashboard", icon: "🏠", label: "Dashboard" },
  { path: "/admin/products", icon: "🧸", label: "Products" },
  { path: "/admin/orders", icon: "📦", label: "Orders" },
  { path: "/admin/customers", icon: "👶", label: "Customers" },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className={`admin-layout ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <span className="logo-icon">🛒</span>
          {sidebarOpen && <span className="sidebar-title">ToyCart</span>}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <span>🚪</span>
          {sidebarOpen && <span>Logout</span>}
        </button>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "◁" : "▷"}
          </button>
          <div className="topbar-right">
            <span className="admin-badge">Admin</span>
            <span className="admin-email">admin@store.com</span>
          </div>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
