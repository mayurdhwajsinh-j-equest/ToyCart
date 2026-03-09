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

const EmptyOrders = ({ onShop }) => (
  <div className="mo-empty">
    <div className="mo-empty-illustration">
      <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background blobs */}
        <ellipse cx="160" cy="210" rx="128" ry="36" fill="#CCFBF1" opacity="0.5"/>
        <ellipse cx="55"  cy="65"  rx="45"  ry="45"  fill="#F7FFB4" opacity="0.5"/>
        <ellipse cx="268" cy="72"  rx="30"  ry="30"  fill="#DECCFE" opacity="0.45"/>

        {/* Package / box body */}
        <rect x="80" y="110" width="160" height="110" rx="14" fill="white" stroke="#DECCFE" strokeWidth="3"/>
        {/* Box top flap left */}
        <path d="M80 110 L80 75 L155 75 L155 110" fill="#F7FFB4" stroke="#DECCFE" strokeWidth="2.5"/>
        {/* Box top flap right */}
        <path d="M165 75 L165 110 L240 110 L240 75" fill="#DECCFE" stroke="#b89ef8" strokeWidth="2.5"/>
        {/* Tape strip across top */}
        <rect x="145" y="68" width="30" height="48" rx="6" fill="#b89ef8" opacity="0.5"/>

        {/* Box face — sad */}
        <rect x="95" y="125" width="130" height="80" rx="10" fill="#F8F5FF"/>
        <circle cx="135" cy="158" r="5" fill="#b89ef8"/>
        <circle cx="185" cy="158" r="5" fill="#b89ef8"/>
        <path d="M145 180 Q160 170 175 180" stroke="#b89ef8" strokeWidth="3" strokeLinecap="round" fill="none"/>

        {/* Bow on top */}
        <path d="M148 72 Q160 58 172 72" stroke="#EDC2C9" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <circle cx="160" cy="72" r="5" fill="#EDC2C9"/>

        {/* Stars */}
        <text x="18"  y="48"  fontSize="18" opacity="0.7">✦</text>
        <text x="274" y="118" fontSize="14" opacity="0.6">✦</text>
        <text x="255" y="185" fontSize="10" opacity="0.5">✦</text>

        {/* Floating emojis */}
        <text x="260" y="58"  fontSize="20">🧸</text>
        <text x="20"  y="145" fontSize="17">🎁</text>
        <text x="268" y="208" fontSize="15">⭐</text>
        <text x="22"  y="210" fontSize="15">🎀</text>
      </svg>
    </div>
    <h2 className="mo-empty-title">No orders yet!</h2>
    <p className="mo-empty-desc">You haven't placed any orders.<br/>Start exploring our toy collection!</p>
    <button className="mo-shop-btn" onClick={onShop}>Browse Toys 🧸</button>
  </div>
);

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
        <EmptyOrders onShop={() => navigate("/Alltoys")} />
      )}

      {/* Orders list */}
      <div className="mo-list">
        {orders.map((order) => {
          const status    = statusConfig[order.status] || statusConfig.pending;
          const isOpen    = expandedOrder === order.id;
          const itemCount = order.OrderItems?.length || 0;

          return (
            <div key={order.id} className={`mo-card ${isOpen ? "mo-card--open" : ""}`}>

              {/* Card header */}
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
                      const steps     = ["pending","confirmed","processing","shipped","delivered"];
                      const current   = steps.indexOf(order.status);
                      const isCancelled = order.status === "cancelled";
                      const done      = !isCancelled && i <= current;
                      const active    = !isCancelled && i === current;
                      const cfg       = statusConfig[s];
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
