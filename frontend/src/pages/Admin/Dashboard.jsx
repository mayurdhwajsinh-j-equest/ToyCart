import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Admin.css";

// Mock stats - replace with real API calls
const mockStats = {
  totalProducts: 48,
  totalOrders: 312,
  totalCustomers: 198,
  totalRevenue: 24850,
  recentOrders: [
    { id: "ORD-001", customer: "Arjun Mehta", amount: 2499, status: "delivered", date: "2026-02-25" },
    { id: "ORD-002", customer: "Priya Shah", amount: 1199, status: "processing", date: "2026-02-25" },
    { id: "ORD-003", customer: "Rohit Kumar", amount: 3599, status: "shipped", date: "2026-02-24" },
    { id: "ORD-004", customer: "Sneha Patel", amount: 899, status: "pending", date: "2026-02-24" },
    { id: "ORD-005", customer: "Karan Joshi", amount: 5499, status: "delivered", date: "2026-02-23" },
  ],
};

const statusColors = {
  delivered: "#22c55e",
  processing: "#f59e0b",
  shipped: "#3b82f6",
  pending: "#94a3b8",
  cancelled: "#ef4444",
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Replace with: fetch('/api/admin/stats').then(r => r.json()).then(setStats)
    setTimeout(() => setStats(mockStats), 400);
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

      {/* Stat Cards */}
      <div className="stats-grid">
        {[
          { label: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: "◈", color: "#1B2A6B", link: "/admin/orders" },
          { label: "Products", value: stats.totalProducts, icon: "◉", color: "#E91E8C", link: "/admin/products" },
          { label: "Orders", value: stats.totalOrders, icon: "◎", color: "#F5C518", link: "/admin/orders" },
          { label: "Customers", value: stats.totalCustomers, icon: "◐", color: "#9B8EC4", link: "/admin/customers" },
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
