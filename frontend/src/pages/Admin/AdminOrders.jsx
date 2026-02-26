import { useState } from "react";
import "./Admin.css";

const mockOrders = [
  { id: "ORD-001", customer: "Arjun Mehta", email: "arjun@email.com", amount: 2499, status: "delivered", date: "2026-02-25", items: [{ name: "Classic Oxford Shirt", qty: 1, price: 1499 }, { name: "Leather Belt", qty: 1, price: 999 }], address: "12 MG Road, Ahmedabad, GJ 380001" },
  { id: "ORD-002", customer: "Priya Shah", email: "priya@email.com", amount: 1199, status: "processing", date: "2026-02-25", items: [{ name: "Slim Fit Chinos", qty: 1, price: 1199 }], address: "45 Navrangpura, Ahmedabad, GJ 380009" },
  { id: "ORD-003", customer: "Rohit Kumar", email: "rohit@email.com", amount: 3599, status: "shipped", date: "2026-02-24", items: [{ name: "Formal Blazer", qty: 1, price: 3599 }], address: "8 Satellite Road, Ahmedabad, GJ 380015" },
  { id: "ORD-004", customer: "Sneha Patel", email: "sneha@email.com", amount: 899, status: "pending", date: "2026-02-24", items: [{ name: "Canvas Sneakers", qty: 1, price: 899 }], address: "22 Bopal, Ahmedabad, GJ 380058" },
  { id: "ORD-005", customer: "Karan Joshi", email: "karan@email.com", amount: 5499, status: "delivered", date: "2026-02-23", items: [{ name: "Leather Derby Shoes", qty: 1, price: 3999 }, { name: "Merino Sweater", qty: 1, price: 1499 }], address: "3 Vastrapur, Ahmedabad, GJ 380054" },
  { id: "ORD-006", customer: "Nisha Iyer", email: "nisha@email.com", amount: 750, status: "cancelled", date: "2026-02-22", items: [{ name: "Pocket Square", qty: 3, price: 249 }], address: "17 Paldi, Ahmedabad, GJ 380007" },
];

const statusColors = {
  delivered: "#22c55e",
  processing: "#f59e0b",
  shipped: "#3b82f6",
  pending: "#94a3b8",
  cancelled: "#ef4444",
};

const allStatuses = ["All", "pending", "processing", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Orders</h2>
        <span className="admin-count">{filtered.length} orders</span>
      </div>

      <div className="admin-filters">
        <input
          className="admin-search"
          placeholder="Search by order ID or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="status-filter-row">
          {allStatuses.map((s) => (
            <button
              key={s}
              className={`status-filter-btn ${statusFilter === s ? "active" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id}>
                <td className="order-id">{order.id}</td>
                <td>
                  <div>{order.customer}</div>
                  <div className="sub-text">{order.email}</div>
                </td>
                <td>₹{order.amount.toLocaleString()}</td>
                <td>
                  <span
                    className="status-badge"
                    style={{
                      background: statusColors[order.status] + "22",
                      color: statusColors[order.status],
                    }}
                  >
                    {order.status}
                  </span>
                </td>
                <td>{order.date}</td>
                <td>
                  <button
                    className="admin-btn-edit"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty-state">No orders found.</div>}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal order-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedOrder.id}</h3>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            <div className="order-detail-grid">
              <div className="order-detail-section">
                <h4>Customer</h4>
                <p>{selectedOrder.customer}</p>
                <p className="sub-text">{selectedOrder.email}</p>
                <p className="sub-text">{selectedOrder.address}</p>
              </div>
              <div className="order-detail-section">
                <h4>Order Info</h4>
                <p>Date: {selectedOrder.date}</p>
                <p>Total: ₹{selectedOrder.amount.toLocaleString()}</p>
              </div>
            </div>

            <div className="order-items">
              <h4>Items</h4>
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="order-item-row">
                  <span>{item.name}</span>
                  <span>Qty: {item.qty}</span>
                  <span>₹{item.price.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="order-status-update">
              <h4>Update Status</h4>
              <div className="status-btns">
                {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                  <button
                    key={s}
                    className={`status-update-btn ${selectedOrder.status === s ? "current" : ""}`}
                    style={{ "--color": statusColors[s] }}
                    onClick={() => updateStatus(selectedOrder.id, s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
