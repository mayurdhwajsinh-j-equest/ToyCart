import { useState } from "react";
import "./Admin.css";

const mockCustomers = [
  {
    id: 1, name: "Arjun Mehta", email: "arjun@email.com", phone: "+91 98765 43210",
    joinDate: "2025-06-12", totalOrders: 8, totalSpend: 18450,
    orders: [
      { id: "ORD-001", date: "2026-02-25", amount: 2499, status: "delivered" },
      { id: "ORD-009", date: "2026-01-10", amount: 3999, status: "delivered" },
    ],
  },
  {
    id: 2, name: "Priya Shah", email: "priya@email.com", phone: "+91 87654 32109",
    joinDate: "2025-08-20", totalOrders: 5, totalSpend: 9870,
    orders: [
      { id: "ORD-002", date: "2026-02-25", amount: 1199, status: "processing" },
    ],
  },
  {
    id: 3, name: "Rohit Kumar", email: "rohit@email.com", phone: "+91 76543 21098",
    joinDate: "2025-09-05", totalOrders: 3, totalSpend: 7890,
    orders: [
      { id: "ORD-003", date: "2026-02-24", amount: 3599, status: "shipped" },
    ],
  },
  {
    id: 4, name: "Sneha Patel", email: "sneha@email.com", phone: "+91 65432 10987",
    joinDate: "2025-11-18", totalOrders: 2, totalSpend: 2100,
    orders: [
      { id: "ORD-004", date: "2026-02-24", amount: 899, status: "pending" },
    ],
  },
  {
    id: 5, name: "Karan Joshi", email: "karan@email.com", phone: "+91 54321 09876",
    joinDate: "2025-03-01", totalOrders: 14, totalSpend: 42300,
    orders: [
      { id: "ORD-005", date: "2026-02-23", amount: 5499, status: "delivered" },
    ],
  },
];

const statusColors = {
  delivered: "#22c55e", processing: "#f59e0b",
  shipped: "#3b82f6", pending: "#94a3b8", cancelled: "#ef4444",
};

const AdminCustomers = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = mockCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Customers</h2>
        <span className="admin-count">{filtered.length} registered</span>
      </div>

      <div className="admin-filters">
        <input
          className="admin-search"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Joined</th>
              <th>Orders</th>
              <th>Total Spend</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <div className="customer-cell">
                    <div className="customer-avatar">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <div>{customer.name}</div>
                      <div className="sub-text">{customer.email}</div>
                    </div>
                  </div>
                </td>
                <td>{customer.phone}</td>
                <td>{customer.joinDate}</td>
                <td>{customer.totalOrders} orders</td>
                <td>₹{customer.totalSpend.toLocaleString()}</td>
                <td>
                  <button className="admin-btn-edit" onClick={() => setSelected(customer)}>
                    View History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty-state">No customers found.</div>}
      </div>

      {/* Customer Detail Modal */}
      {selected && (
        <div className="admin-modal-overlay" onClick={() => setSelected(null)}>
          <div className="admin-modal order-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Customer Profile</h3>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="customer-profile">
              <div className="customer-avatar large">{selected.name.charAt(0)}</div>
              <div>
                <h3>{selected.name}</h3>
                <p className="sub-text">{selected.email}</p>
                <p className="sub-text">{selected.phone}</p>
                <p className="sub-text">Member since {selected.joinDate}</p>
              </div>
            </div>

            <div className="customer-stats-row">
              <div className="cust-stat">
                <div className="stat-value">{selected.totalOrders}</div>
                <div className="stat-label">Total Orders</div>
              </div>
              <div className="cust-stat">
                <div className="stat-value">₹{selected.totalSpend.toLocaleString()}</div>
                <div className="stat-label">Total Spent</div>
              </div>
            </div>

            <div className="order-items">
              <h4>Order History</h4>
              {selected.orders.map((order) => (
                <div key={order.id} className="order-item-row">
                  <span className="order-id">{order.id}</span>
                  <span>{order.date}</span>
                  <span>₹{order.amount.toLocaleString()}</span>
                  <span
                    className="status-badge"
                    style={{ background: statusColors[order.status] + "22", color: statusColors[order.status] }}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
