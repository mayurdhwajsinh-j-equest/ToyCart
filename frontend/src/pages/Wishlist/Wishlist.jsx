import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Wishlist.css";
import APIService from "../../services/api";
import { useCart } from "../../hooks/useCart";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const resolveImage = (src) => {
    if (!src) return null;
    if (src.startsWith("http")) return src;
    if (src.startsWith("/uploads")) return `${API_BASE}${src}`;
    return src;
};

const EmptyWishlist = ({ onBrowse }) => (
    <div className="wl-empty">
        <div className="wl-empty-illustration">
            <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background blobs */}
                <ellipse cx="160" cy="210" rx="130" ry="36" fill="#EDC2C9" opacity="0.3"/>
                <ellipse cx="60"  cy="70"  rx="48"  ry="48"  fill="#F7FFB4" opacity="0.45"/>
                <ellipse cx="265" cy="75"  rx="32"  ry="32"  fill="#DECCFE" opacity="0.4"/>

                {/* Big heart outline */}
                <path d="M160 210 C80 160 40 120 40 80 C40 55 60 38 85 38 C105 38 130 55 160 80 C190 55 215 38 235 38 C260 38 280 55 280 80 C280 120 240 160 160 210Z"
                      fill="#fde8eb" stroke="#EDC2C9" strokeWidth="3"/>

                {/* Inner heart dashed */}
                <path d="M160 185 C100 145 72 115 72 88 C72 72 83 62 97 62 C112 62 132 74 160 96 C188 74 208 62 223 62 C237 62 248 72 248 88 C248 115 220 145 160 185Z"
                      fill="none" stroke="#d88a96" strokeWidth="2.5" strokeDasharray="6 4"/>

                {/* Question mark inside heart */}
                <text x="148" y="138" fontSize="38" fill="#d88a96" fontWeight="900" fontFamily="Nunito, sans-serif">?</text>

                {/* Floating items around */}
                <text x="20"  y="50"  fontSize="20">🌟</text>
                <text x="272" y="170" fontSize="16">✨</text>
                <text x="15"  y="175" fontSize="14">💫</text>
                <text x="268" y="50"  fontSize="20">🧸</text>
                <text x="270" y="220" fontSize="16">🎀</text>
                <text x="22"  y="220" fontSize="16">🎈</text>
            </svg>
        </div>
        <h2 className="wl-empty-title">Your wishlist is empty</h2>
        <p className="wl-empty-desc">Save your favourite toys here and<br/>come back to them anytime!</p>
        <button className="wl-browse-btn" onClick={onBrowse}>Browse Toys 🧸</button>
    </div>
);

function Wishlist() {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const token = typeof window !== "undefined" ? localStorage.getItem("customerToken") : null;

    const [items,    setItems]    = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState("");
    const [removing, setRemoving] = useState(null);
    const [addingToCart, setAddingToCart] = useState(null);

    useEffect(() => {
        if (!token) { navigate("/login"); return; }
        loadWishlist();
    }, [token]);

    const loadWishlist = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await APIService.getWishlist(token);
            setItems(data.items || []);
        } catch {
            setError("Unable to load your wishlist.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        try {
            setRemoving(productId);
            await APIService.removeFromWishlist(productId, token);
            setItems((prev) => prev.filter((i) => i.productId !== productId));
        } catch {
            setError("Could not remove item.");
        } finally {
            setRemoving(null);
        }
    };

    const handleAddToCart = async (product) => {
        try {
            setAddingToCart(product.id);
            await addToCart(product);
        } catch {
            setError("Could not add item to cart.");
        } finally {
            setAddingToCart(null);
        }
    };

    if (loading) return (
        <div className="wl-loading">
            <div className="wl-spinner" />
            <p>Loading your wishlist...</p>
        </div>
    );

    return (
        <div className="wl-page">
            {/* Header */}
            <div className="wl-header">
                <div>
                    <h1 className="wl-title">My Wishlist</h1>
                    <p className="wl-subtitle">Your favourite toys, saved for later 🧸</p>
                </div>
                {items.length > 0 && (
                    <span className="wl-count">{items.length} item{items.length !== 1 ? "s" : ""}</span>
                )}
            </div>

            {error && <div className="wl-error">{error}</div>}

            {/* Empty state */}
            {!loading && items.length === 0 && !error && (
                <EmptyWishlist onBrowse={() => navigate("/Alltoys")} />
            )}

            {/* Grid */}
            <div className="wl-grid">
                {items.map((item) => {
                    const product = item.Product;
                    if (!product) return null;
                    const filled = Math.round(product.rating || 0);
                    const isOOS  = product.availability === "out_of_stock" || product.stock <= 0;

                    return (
                        <div key={item.id} className={`wl-card ${isOOS ? "wl-card--oos" : ""}`}>
                            <button
                                className="wl-remove-btn"
                                onClick={() => handleRemove(item.productId)}
                                disabled={removing === item.productId}
                                title="Remove from wishlist"
                            >
                                {removing === item.productId ? "..." : "✕"}
                            </button>

                            <div className="wl-img-wrap" onClick={() => navigate(`/Pdp/${product.id}`)}>
                                {product.image_url ? (
                                    <img
                                        src={resolveImage(product.image_url)}
                                        alt={product.name}
                                        className="wl-img"
                                        onError={(e) => { e.target.style.display = "none"; }}
                                    />
                                ) : (
                                    <div className="wl-img-placeholder">🧸</div>
                                )}
                                {isOOS && <div className="wl-oos-overlay">Out of Stock</div>}
                            </div>

                            <div className="wl-card-body">
                                <p className="wl-product-name" onClick={() => navigate(`/Pdp/${product.id}`)}>
                                    {product.name}
                                </p>
                                <div className="wl-stars">
                                    {[1,2,3,4,5].map((n) => (
                                        <span key={n} className={`wl-star ${n <= filled ? "wl-star--filled" : ""}`}>★</span>
                                    ))}
                                </div>
                                <p className="wl-price">₹{Number(product.price).toLocaleString()}</p>
                                <button
                                    className={`wl-add-btn ${isOOS ? "wl-add-btn--disabled" : ""}`}
                                    onClick={() => !isOOS && handleAddToCart(product)}
                                    disabled={isOOS || addingToCart === product.id}
                                >
                                    {addingToCart === product.id ? "Adding..." : isOOS ? "Out of Stock" : "Add to Toybox"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Wishlist;
