import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Wishlist.css";
import APIService from "../../services/api";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const resolveImage = (src) => {
    if (!src) return null;
    if (src.startsWith("http")) return src;
    if (src.startsWith("/uploads")) return `${API_BASE}${src}`;
    return src;
};

function Wishlist() {
    const navigate = useNavigate();
    const token = typeof window !== "undefined" ? localStorage.getItem("customerToken") : null;

    const [items,   setItems]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState("");
    const [removing, setRemoving] = useState(null);

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

    const handleAddToCart = (productId) => {
        navigate(`/Pdp/${productId}`);
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
                <div className="wl-empty">
                    <div className="wl-empty-icon">♡</div>
                    <h2>Your wishlist is empty</h2>
                    <p>Save your favourite toys here and come back to them anytime!</p>
                    <button className="wl-browse-btn" onClick={() => navigate("/Alltoys")}>
                        Browse Toys
                    </button>
                </div>
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
                            {/* Remove button */}
                            <button
                                className="wl-remove-btn"
                                onClick={() => handleRemove(item.productId)}
                                disabled={removing === item.productId}
                                title="Remove from wishlist"
                            >
                                {removing === item.productId ? "..." : "✕"}
                            </button>

                            {/* Image */}
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

                            {/* Info */}
                            <div className="wl-card-body">
                                <p className="wl-product-name" onClick={() => navigate(`/Pdp/${product.id}`)}>
                                    {product.name}
                                </p>

                                {/* Stars */}
                                <div className="wl-stars">
                                    {[1,2,3,4,5].map((n) => (
                                        <span key={n} className={`wl-star ${n <= filled ? "wl-star--filled" : ""}`}>★</span>
                                    ))}
                                </div>

                                <p className="wl-price">₹{Number(product.price).toLocaleString()}</p>

                                <button
                                    className={`wl-add-btn ${isOOS ? "wl-add-btn--disabled" : ""}`}
                                    onClick={() => !isOOS && handleAddToCart(product.id)}
                                    disabled={isOOS}
                                >
                                    {isOOS ? "Out of Stock" : "Add to Toybox"}
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
