import { useState, useEffect } from "react";
import "./Admin.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const token = () => localStorage.getItem("adminToken");

const statusColors = {
  delivered:  "#22c55e",
  confirmed:  "#3b82f6",
  processing: "#f59e0b",
  shipped:    "#6366f1",
  pending:    "#94a3b8",
  cancelled:  "#ef4444",
};

const allStatuses = ["All", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const PAGE_SIZE = 10;

const AdminOrders = () => {
  const [orders,        setOrders]        = useState([]);
  const [search,        setSearch]        = useState("");
  const [statusFilter,  setStatusFilter]  = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [updating,      setUpdating]      = useState(false);

  // Pagination
  const [currentPage,   setCurrentPage]   = useState(1);

  // ── Fetch orders ─────────────────────────────────────────
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 100 });
      if (statusFilter !== "All") params.set("status", statusFilter);
      if (search)                  params.set("search", search);

      const res  = await fetch(`${API_URL}/api/admin/orders?${params}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
      else setError(data.message || "Failed to load orders.");
    } catch {
      setError("Cannot connect to server.");
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [search, statusFilter]);

  // Reset to page 1 when search or status filter changes
  useEffect(() => { setCurrentPage(1); }, [search, statusFilter]);

  // ── Pagination derived values ──
  const totalPages      = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedOrders = orders.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safeCurrentPage > 3) pages.push("…");
      for (
        let i = Math.max(2, safeCurrentPage - 1);
        i <= Math.min(totalPages - 1, safeCurrentPage + 1);
        i++
      ) pages.push(i);
      if (safeCurrentPage < totalPages - 2) pages.push("…");
      pages.push(totalPages);
    }
    return pages;
  };

  // ── Update status ─────────────────────────────────────────
  const updateStatus = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      const res  = await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
        }
      } else {
        alert(data.message || "Failed to update status.");
      }
    } catch {
      alert("Cannot connect to server.");
    }
    setUpdating(false);
  };

  // ── View order detail ─────────────────────────────────────
  const viewOrder = async (order) => {
    try {
      const res  = await fetch(`${API_URL}/api/admin/orders/${order.id}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      if (data.success) setSelectedOrder(data.order);
      else setSelectedOrder(order);
    } catch {
      setSelectedOrder(order);
    }
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Orders</h2>
        <span className="admin-count">{orders.length} orders</span>
      </div>

      {error && <div className="admin-error-msg">{error}</div>}

      <div className="admin-filters">
        <input
          className="admin-search"
          placeholder="Search by customer name or email..."
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

      {loading ? (
        <div className="admin-loading">Loading orders...</div>
      ) : (
        <>
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
                {paginatedOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id">#{order.id}</td>
                    <td>
                      <div>{order.User?.name || "—"}</div>
                      <div className="sub-text">{order.User?.email}</div>
                    </td>
                    <td>₹{Number(order.total_amount).toLocaleString()}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          background: (statusColors[order.status] || "#94a3b8") + "22",
                          color: statusColors[order.status] || "#94a3b8",
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
                    <td>
                      <button className="admin-btn-edit" onClick={() => viewOrder(order)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <div className="empty-state">No orders found.</div>}
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="pagination-bar">
              <span className="pagination-info">
                Showing {(safeCurrentPage - 1) * PAGE_SIZE + 1}–{Math.min(safeCurrentPage * PAGE_SIZE, orders.length)} of {orders.length} orders
              </span>
              <div className="pagination-controls">
                <button
                  className="page-btn page-nav"
                  onClick={() => goToPage(safeCurrentPage - 1)}
                  disabled={safeCurrentPage === 1}
                  title="Previous page"
                >
                  ‹
                </button>

                {getPageNumbers().map((page, idx) =>
                  page === "…" ? (
                    <span key={`ellipsis-${idx}`} className="page-ellipsis">…</span>
                  ) : (
                    <button
                      key={page}
                      className={`page-btn ${safeCurrentPage === page ? "active" : ""}`}
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  className="page-btn page-nav"
                  onClick={() => goToPage(safeCurrentPage + 1)}
                  disabled={safeCurrentPage === totalPages}
                  title="Next page"
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal order-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order #{selectedOrder.id}</h3>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            <div className="order-detail-grid">
              <div className="order-detail-section">
                <h4>Customer</h4>
                <p>{selectedOrder.User?.name || "—"}</p>
                <p className="sub-text">{selectedOrder.User?.email}</p>
                <p className="sub-text">{selectedOrder.User?.phone}</p>
                <p className="sub-text">{selectedOrder.shipping_address}</p>
              </div>
              <div className="order-detail-section">
                <h4>Order Info</h4>
                <p>Date: {new Date(selectedOrder.createdAt).toLocaleDateString("en-IN")}</p>
                <p>Total: ₹{Number(selectedOrder.total_amount).toLocaleString()}</p>
                {selectedOrder.tracking_number && (
                  <p className="sub-text">Tracking: {selectedOrder.tracking_number}</p>
                )}
              </div>
            </div>

            <div className="order-items">
              <h4>Items</h4>
              {selectedOrder.OrderItems?.map((item, i) => (
                <div key={i} className="order-item-row">
                  <span>{item.Product?.name || `Product #${item.productId}`}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>₹{Number(item.price).toLocaleString()}</span>
                </div>
              ))}
              {!selectedOrder.OrderItems?.length && (
                <p className="sub-text">No item details available.</p>
              )}
            </div>

            <div className="order-status-update">
              <h4>Update Status</h4>
              <div className="status-btns">
                {["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                  <button
                    key={s}
                    className={`status-update-btn ${selectedOrder.status === s ? "current" : ""}`}
                    style={{ "--color": statusColors[s] }}
                    disabled={updating}
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
