import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Admin.css";
import APIService from "../../services/api";

const statusColors = {
  delivered: "#22c55e",
  processing: "#f59e0b",
  shipped: "#3b82f6",
  pending: "#94a3b8",
  cancelled: "#ef4444",
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const fetchStats = async () => {
      try {
        setError("");
        const data = await APIService.getAdminDashboardStats(token);
        const s = data?.stats || {};

        const recentOrders = (s.recentOrders || []).map((o) => ({
          id: o.id,
          customer: o.User?.name || "Unknown",
          amount: Number(o.total_amount || 0),
          status: o.status,
          date: new Date(o.createdAt).toISOString().slice(0, 10),
        }));

        setStats({
          totalProducts: s.totalProducts || 0,
          totalOrders: s.totalOrders || 0,
          totalCustomers: s.totalCustomers || 0,
          totalRevenue: s.totalRevenue || 0,
          recentOrders,
        });
      } catch (err) {
        setError("Unable to load dashboard stats.");
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <div className="admin-loading">Loading dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h2>Dashboard</h2>
        <span className="admin-date">
          {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}
        </span>
      </div>

      {error && <p style={{ color: "#c00", marginBottom: "12px" }}>{error}</p>}

      {/* Stat Cards */}
      <div className="stats-grid">
        {[
          { label: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: "🪙", color: "#255F83", link: "/admin/orders" },
          { label: "Products", value: stats.totalProducts, icon: "🧸", color: "#b89ef8", link: "/admin/products" },
          { label: "Orders", value: stats.totalOrders, icon: "📦", color: "#c8d800", link: "/admin/orders" },
          { label: "Customers", value: stats.totalCustomers, icon: "🎈", color: "#d88a96", link: "/admin/customers" },
        ].map((stat) => (
          <Link to={stat.link} key={stat.label} className="stat-card" style={{ "--accent": stat.color }}>
            <div className="stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
            <div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="admin-section">
        <div className="section-header">
          <h3>Recent Orders</h3>
          <Link to="/admin/orders" className="view-all-link">View all →</Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">{order.id}</td>
                  <td>{order.customer}</td>
                  <td>₹{order.amount.toLocaleString()}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ background: statusColors[order.status] + "22", color: statusColors[order.status] }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
