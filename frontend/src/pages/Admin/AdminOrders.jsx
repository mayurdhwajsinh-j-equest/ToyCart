import { useEffect, useState } from "react";
import "./Admin.css";
import APIService from "../../services/api";

const statusColors = {
  delivered: "#22c55e",
  processing: "#f59e0b",
  shipped: "#3b82f6",
  pending: "#94a3b8",
  cancelled: "#ef4444",
};

const allStatuses = ["All", "pending", "processing", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (statusFilter !== "All") params.status = statusFilter;
      if (search) params.search = search;

      const data = await APIService.getAdminOrders(params, token);
      const list = (data.orders || []).map((o) => ({
        id: o.id,
        customer: o.User?.name || "Unknown",
        email: o.User?.email || "",
        amount: Number(o.total_amount || 0),
        status: o.status,
        date: new Date(o.createdAt).toISOString().slice(0, 10),
      }));
      setOrders(list);
    } catch (err) {
      setError("Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (orderId, newStatus) => {
    try {
      setError("");
      await APIService.updateAdminOrderStatus(orderId, { status: newStatus }, token);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      setError("Unable to update order status.");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Orders</h2>
        <span className="admin-count">{filtered.length} orders</span>
      </div>

      {error && <p style={{ color: "#c00", marginBottom: "12px" }}>{error}</p>}

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
        {loading && <div className="admin-loading">Loading orders...</div>}
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
