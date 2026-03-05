import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyOrders.css";
import APIService from "../../services/api";

const statusConfig = {
  pending:    { label: "Pending",    color: "#94a3b8", bg: "#f1f5f9", icon: "🕐" },
  confirmed:  { label: "Confirmed",  color: "#8b5cf6", bg: "#f5f3ff", icon: "✅" },
  processing: { label: "Processing", color: "#f59e0b", bg: "#fffbeb", icon: "⚙️" },
  shipped:    { label: "Shipped",    color: "#3b82f6", bg: "#eff6ff", icon: "🚚" },
  delivered:  { label: "Delivered",  color: "#22c55e", bg: "#f0fdf4", icon: "🎉" },
  cancelled:  { label: "Cancelled",  color: "#ef4444", bg: "#fef2f2", icon: "✕"  },
};

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const resolveImage = (src) => {
  if (!src) return null;
  if (src.startsWith("http")) return src;
  if (src.startsWith("/uploads")) return `${API_BASE}${src}`;
  return src;
};

function MyOrders() {
  const navigate = useNavigate();
  const token = typeof window !== "undefined" ? localStorage.getItem("customerToken") : null;

  const [orders,        setOrders]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    APIService.getOrders(token)
      .then((data) => setOrders(data.orders || []))
      .catch(() => setError("Unable to load your orders. Please try again."))
      .finally(() => setLoading(false));
  }, [token]);

  const toggleOrder = (id) =>
    setExpandedOrder((prev) => (prev === id ? null : id));

  if (loading) return (
    <div className="mo-loading">
      <div className="mo-spinner" />
      <p>Loading your orders...</p>
    </div>
  );

  return (
    <div className="mo-page">
      {/* Header */}
      <div className="mo-header">
        <div className="mo-header-inner">
          <h1 className="mo-title">My Orders</h1>
          <p className="mo-subtitle">Track everything you've ordered from ToyCart 🧸</p>
        </div>
        <button className="mo-shop-btn" onClick={() => navigate("/Alltoys")}>
          + Shop More Toys
        </button>
      </div>

      {error && <div className="mo-error">{error}</div>}

      {/* Empty state */}
      {!loading && orders.length === 0 && !error && (
        <div className="mo-empty">
          <div className="mo-empty-icon">🛒</div>
          <h2>No orders yet!</h2>
          <p>You haven't placed any orders. Start exploring our toy collection!</p>
          <button className="mo-shop-btn" onClick={() => navigate("/Alltoys")}>Browse Toys</button>
        </div>
      )}

      {/* Orders list */}
      <div className="mo-list">
        {orders.map((order) => {
          const status   = statusConfig[order.status] || statusConfig.pending;
          const isOpen   = expandedOrder === order.id;
          const itemCount = order.OrderItems?.length || 0;

          return (
            <div key={order.id} className={`mo-card ${isOpen ? "mo-card--open" : ""}`}>

              {/* Card header — always visible */}
              <div className="mo-card-header" onClick={() => toggleOrder(order.id)}>
                <div className="mo-card-left">
                  <div className="mo-order-number">
                    {order.order_number || `#${order.id}`}
                  </div>
                  <div className="mo-order-meta">
                    <span>📅 {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    <span>·</span>
                    <span>{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
                  </div>
                </div>

                <div className="mo-card-right">
                  <span className="mo-status-badge" style={{ color: status.color, background: status.bg }}>
                    {status.icon} {status.label}
                  </span>
                  <span className="mo-amount">₹{Number(order.total_amount).toLocaleString()}</span>
                  <span className={`mo-chevron ${isOpen ? "mo-chevron--up" : ""}`}>▾</span>
                </div>
              </div>

              {/* Expanded details */}
              {isOpen && (
                <div className="mo-card-body">

                  {/* Status timeline */}
                  <div className="mo-timeline">
                    {["pending", "confirmed", "processing", "shipped", "delivered"].map((s, i) => {
                      const steps   = ["pending","confirmed","processing","shipped","delivered"];
                      const current = steps.indexOf(order.status);
                      const isCancelled = order.status === "cancelled";
                      const done    = !isCancelled && i <= current;
                      const active  = !isCancelled && i === current;
                      const cfg     = statusConfig[s];
                      return (
                        <div key={s} className={`mo-step ${done ? "mo-step--done" : ""} ${active ? "mo-step--active" : ""} ${isCancelled ? "mo-step--cancelled" : ""}`}>
                          <div className="mo-step-dot">{done ? "✓" : cfg.icon}</div>
                          <div className="mo-step-label">{cfg.label}</div>
                          {i < 4 && <div className={`mo-step-line ${done && i < current ? "mo-step-line--done" : ""}`} />}
                        </div>
                      );
                    })}
                    {order.status === "cancelled" && (
                      <div className="mo-cancelled-banner">✕ This order was cancelled</div>
                    )}
                  </div>

                  {/* Order items */}
                  <div className="mo-items-section">
                    <h4 className="mo-section-title">Items Ordered</h4>
                    <div className="mo-items">
                      {(order.OrderItems || []).map((item) => (
                        <div key={item.id} className="mo-item">
                          {item.Product?.image_url ? (
                            <img
                              src={resolveImage(item.Product.image_url)}
                              alt={item.Product?.name}
                              className="mo-item-img"
                              onError={(e) => { e.target.style.display = "none"; }}
                            />
                          ) : (
                            <div className="mo-item-img-placeholder">🧸</div>
                          )}
                          <div className="mo-item-info">
                            <p className="mo-item-name">{item.Product?.name || "Product"}</p>
                            <p className="mo-item-qty">Qty: {item.quantity}</p>
                          </div>
                          <div className="mo-item-price">
                            ₹{Number(item.price || item.Product?.price || 0).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery + summary */}
                  <div className="mo-details-grid">
                    <div className="mo-detail-box">
                      <h4 className="mo-section-title">Delivery Details</h4>
                      <p>📍 {order.delivery_address}</p>
                      {order.city  && <p>🏙️ {order.city}{order.state ? `, ${order.state}` : ""}</p>}
                      {order.zipcode && <p>📮 {order.zipcode}</p>}
                      {order.phone   && <p>📞 {order.phone}</p>}
                      {order.tracking_number && (
                        <p className="mo-tracking">🔍 Tracking: <strong>{order.tracking_number}</strong></p>
                      )}
                    </div>

                    <div className="mo-detail-box">
                      <h4 className="mo-section-title">Order Summary</h4>
                      <div className="mo-summary-row">
                        <span>Subtotal</span>
                        <span>₹{Number(order.total_amount).toLocaleString()}</span>
                      </div>
                      <div className="mo-summary-row">
                        <span>Shipping</span>
                        <span className="mo-free">FREE</span>
                      </div>
                      <div className="mo-summary-row mo-summary-total">
                        <span>Total</span>
                        <span>₹{Number(order.total_amount).toLocaleString()}</span>
                      </div>
                      <div className="mo-payment-method">
                        💳 {order.payment_method === "cash_on_delivery" ? "Cash on Delivery" : order.payment_method}
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyOrders;
