import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyOrders.css";
import APIService from "../../services/api";
import jsPDF from "jspdf";

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

const fmt = (amount) => `Rs. ${Number(amount).toLocaleString("en-IN")}`;

const EmptyOrders = ({ onShop }) => (
  <div className="mo-empty">
    <div className="mo-empty-illustration">
      <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="160" cy="210" rx="128" ry="36" fill="#CCFBF1" opacity="0.5"/>
        <ellipse cx="55"  cy="65"  rx="45"  ry="45"  fill="#F7FFB4" opacity="0.5"/>
        <ellipse cx="268" cy="72"  rx="30"  ry="30"  fill="#DECCFE" opacity="0.45"/>
        <rect x="80" y="110" width="160" height="110" rx="14" fill="white" stroke="#DECCFE" strokeWidth="3"/>
        <path d="M80 110 L80 75 L155 75 L155 110" fill="#F7FFB4" stroke="#DECCFE" strokeWidth="2.5"/>
        <path d="M165 75 L165 110 L240 110 L240 75" fill="#DECCFE" stroke="#b89ef8" strokeWidth="2.5"/>
        <rect x="145" y="68" width="30" height="48" rx="6" fill="#b89ef8" opacity="0.5"/>
        <rect x="95" y="125" width="130" height="80" rx="10" fill="#F8F5FF"/>
        <circle cx="135" cy="158" r="5" fill="#b89ef8"/>
        <circle cx="185" cy="158" r="5" fill="#b89ef8"/>
        <path d="M145 180 Q160 170 175 180" stroke="#b89ef8" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M148 72 Q160 58 172 72" stroke="#EDC2C9" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <circle cx="160" cy="72" r="5" fill="#EDC2C9"/>
        <text x="18"  y="48"  fontSize="18" opacity="0.7">✦</text>
        <text x="274" y="118" fontSize="14" opacity="0.6">✦</text>
        <text x="255" y="185" fontSize="10" opacity="0.5">✦</text>
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
  const [downloadingOrderId, setDownloadingOrderId] = useState(null);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    APIService.getOrders(token)
      .then((data) => setOrders(data.orders || []))
      .catch(() => setError("Unable to load your orders. Please try again."))
      .finally(() => setLoading(false));
  }, [token]);

  const toggleOrder = (id) =>
    setExpandedOrder((prev) => (prev === id ? null : id));

  const downloadInvoice = async (order) => {
    try {
      setDownloadingOrderId(order.id);

      const doc = new jsPDF();
      const pageWidth  = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const left       = 15;
      const right      = pageWidth - 15;
      const colQty     = 130;
      const colPrice   = right;
      let y            = 15;
      const lh         = 6;

      const line = (extra = lh) => { y += extra; };
      const rule = (color = [220, 220, 220]) => {
        doc.setDrawColor(...color);
        doc.line(left, y, right, y);
        line(4);
      };

      doc.setFillColor(37, 95, 131);
      doc.rect(0, 0, pageWidth, 32, "F");

      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("ToyCart", left, 14);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("INVOICE", right, 14, { align: "right" });
      doc.text(`Order: ${order.order_number || `#${order.id}`}`, right, 22, { align: "right" });

      y = 42;

      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`, left, y);
      doc.text(`Status: ${statusConfig[order.status]?.label || order.status}`, pageWidth / 2, y, { align: "center" });
      doc.text(`Payment: ${order.payment_method === "cash_on_delivery" ? "Cash on Delivery" : order.payment_method}`, right, y, { align: "right" });
      line(10);
      rule();

      doc.setFontSize(8);
      doc.setTextColor(37, 95, 131);
      doc.setFont("helvetica", "bold");
      doc.text("DELIVERY ADDRESS", left, y);
      line(lh + 1);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 50, 50);

      const addrLines = doc.splitTextToSize(order.delivery_address, 120);
      doc.text(addrLines, left, y);
      line(addrLines.length * lh);

      if (order.city) {
        doc.text(`${order.city}${order.state ? ", " + order.state : ""}`, left, y);
        line(lh);
      }
      if (order.zipcode) { doc.text(`Postal Code: ${order.zipcode}`, left, y); line(lh); }
      if (order.phone)   { doc.text(`Phone: ${order.phone}`,         left, y); line(lh); }

      line(4);
      rule();

      doc.setFillColor(245, 245, 250);
      doc.rect(left - 2, y - 4, right - left + 4, 8, "F");

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(37, 95, 131);
      doc.text("PRODUCT",  left,    y);
      doc.text("QTY",      colQty,  y, { align: "center" });
      doc.text("UNIT PRICE", colPrice, y, { align: "right" });
      line(lh + 2);

      doc.setDrawColor(200, 200, 220);
      doc.line(left, y - 1, right, y - 1);
      line(2);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 50, 50);

      let subtotal = 0;
      (order.OrderItems || []).forEach((item, idx) => {
        const name  = item.Product?.name || "Product";
        const qty   = item.quantity;
        const price = Number(item.price || item.Product?.price || 0);
        const total = price * qty;
        subtotal   += total;

        // alternate row tint
        if (idx % 2 === 0) {
          doc.setFillColor(250, 250, 255);
          doc.rect(left - 2, y - 4, right - left + 4, lh + 3, "F");
        }

        doc.setFontSize(8);
        const nameLines = doc.splitTextToSize(name, 100);
        doc.text(nameLines, left, y);
        doc.text(String(qty),     colQty,  y, { align: "center" });
        doc.text(fmt(price),      colPrice, y, { align: "right" });
        line((nameLines.length * lh) + 2);
      });

      line(2);
      rule([200, 200, 220]);

      const totalsX = 115;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.text("Subtotal",  totalsX, y);
      doc.text(fmt(subtotal), colPrice, y, { align: "right" });
      line(lh + 1);

      doc.text("Shipping",  totalsX, y);
      doc.setTextColor(34, 197, 94);
      doc.text("FREE", colPrice, y, { align: "right" });
      line(lh + 3);

      doc.setFillColor(37, 95, 131);
      doc.rect(left - 2, y - 4, right - left + 4, 10, "F");
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("TOTAL",         totalsX, y + 2);
      doc.text(fmt(order.total_amount), colPrice, y + 2, { align: "right" });
      line(14);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(160, 160, 160);
      doc.text("Thank you for shopping with ToyCart!", pageWidth / 2, pageHeight - 18, { align: "center" });
      doc.text("For support, contact us at support@toycart.com", pageWidth / 2, pageHeight - 12, { align: "center" });

      doc.setDrawColor(37, 95, 131);
      doc.line(left, pageHeight - 22, right, pageHeight - 22);

      doc.save(`ToyCart-Invoice-${order.order_number || order.id}.pdf`);
    } catch (err) {
      // Invoice generation failed
    } finally {
      setDownloadingOrderId(null);
    }
  };

  if (loading) return (
    <div className="mo-loading">
      <div className="mo-spinner" />
      <p>Loading your orders...</p>
    </div>
  );

  return (
    <div className="mo-page">
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

      {!loading && orders.length === 0 && !error && (
        <EmptyOrders onShop={() => navigate("/Alltoys")} />
      )}

      <div className="mo-list">
        {orders.map((order) => {
          const status    = statusConfig[order.status] || statusConfig.pending;
          const isOpen    = expandedOrder === order.id;
          const itemCount = order.OrderItems?.length || 0;

          return (
            <div key={order.id} className={`mo-card ${isOpen ? "mo-card--open" : ""}`}>

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

              {isOpen && (
                <div className="mo-card-body">

                  <div className="mo-timeline">
                    {["pending", "confirmed", "processing", "shipped", "delivered"].map((s, i) => {
                      const steps       = ["pending","confirmed","processing","shipped","delivered"];
                      const current     = steps.indexOf(order.status);
                      const isCancelled = order.status === "cancelled";
                      const done        = !isCancelled && i <= current;
                      const active      = !isCancelled && i === current;
                      const cfg         = statusConfig[s];
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

                  <div className="mo-details-grid">
                    <div className="mo-detail-box">
                      <h4 className="mo-section-title">Delivery Details</h4>
                      <p>📍 {order.delivery_address}</p>
                      {order.city      && <p>🏙️ {order.city}{order.state ? `, ${order.state}` : ""}</p>}
                      {order.zipcode   && <p>📮 {order.zipcode}</p>}
                      {order.phone     && <p>📞 {order.phone}</p>}
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
                      {order.status === "delivered" && (
                        <button
                          className="mo-download-invoice-btn"
                          onClick={(e) => { e.stopPropagation(); downloadInvoice(order); }}
                          disabled={downloadingOrderId === order.id}
                        >
                          {downloadingOrderId === order.id ? "Generating..." : "📥 Download Invoice"}
                        </button>
                      )}
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
