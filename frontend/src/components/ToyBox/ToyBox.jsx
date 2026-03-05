import "./ToyBox.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import APIService from "../../services/api";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ToyBox() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading,   setLoading]   = useState(false);
    const [error,     setError]     = useState("");

    const token = typeof window !== "undefined" ? localStorage.getItem("customerToken") : null;

    const fetchCart = async () => {
        if (!token) { setCartItems([]); return; }
        try {
            setLoading(true);
            setError("");
            const data = await APIService.getCart(token);
            const mapped = (data.items || []).map((item) => ({
                id:        item.id,
                cartId:    item.id,
                productId: item.productId,
                name:      item.Product?.name,
                image:     item.Product?.image_url
                    ? `${API_BASE}${item.Product.image_url}`
                    : null,
                price:    item.Product?.price,
                quantity: item.quantity,
            }));
            setCartItems(mapped);
        } catch {
            setError("Unable to load your toy box. Please login again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCart(); }, []);

    const handleQuantityChange = async (cartId, newQty) => {
        if (!token || newQty < 1) return;
        try {
            await APIService.updateCartItem(cartId, newQty, token);
            await fetchCart();
        } catch {
            setError("Could not update quantity.");
        }
    };

    const handleRemove = async (cartId) => {
        if (!token) return;
        try {
            await APIService.removeCartItem(cartId, token);
            await fetchCart();
        } catch {
            setError("Could not remove item.");
        }
    };

    const totalPrice = useMemo(
        () => cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0),
        [cartItems]
    );

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <section className="toybox-section">
            <div className="toybox-content">

                {/* ── Header ── */}
                <div className="toybox-header">
                    <h2>Your toy box</h2>
                    {cartItems.length > 0 && (
                        <span className="toybox-item-count">{totalItems} item{totalItems !== 1 ? "s" : ""}</span>
                    )}
                </div>

                {loading && <p className="toybox-status">Loading your toy box...</p>}
                {error && !loading && <p className="toybox-status toybox-error">{error}</p>}

                {/* ── Table ── */}
                <table className="toybox-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.length === 0 && !loading ? (
                            <tr>
                                <td colSpan="5" className="toybox-empty-cell">
                                    Your cart is empty.{" "}
                                    <a href="/Alltoys">Continue shopping</a>
                                </td>
                            </tr>
                        ) : (
                            cartItems.map((item) => (
                                <tr key={item.cartId}>
                                    <td className="product-cell">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="product-image" />
                                        ) : (
                                            <div className="product-image-placeholder">🧸</div>
                                        )}
                                        <span className="product-name">{item.name}</span>
                                    </td>
                                    <td className="price-cell">₹{Number(item.price).toLocaleString()}</td>
                                    <td className="quantity-cell">
                                        <button
                                            className="qty-btn qty-minus"
                                            onClick={() => handleQuantityChange(item.cartId, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >−</button>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            readOnly
                                            className="qty-input"
                                        />
                                        <button
                                            className="qty-btn qty-plus"
                                            onClick={() => handleQuantityChange(item.cartId, item.quantity + 1)}
                                        >+</button>
                                    </td>
                                    <td className="subtotal-cell">
                                        ₹{(Number(item.price) * item.quantity).toLocaleString()}
                                    </td>
                                    <td className="action-cell">
                                        <button
                                            className="remove-btn"
                                            onClick={() => handleRemove(item.cartId)}
                                        >✕ Remove</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* ── Footer ── */}
                {cartItems.length > 0 && (
                    <div className="toybox-footer">
                        <a href="/Alltoys" className="continue-shopping">← Continue Shopping</a>
                        <div className="toybox-summary">
                            <div className="toybox-summary-row">
                                <span>Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})</span>
                                <span>₹{totalPrice.toLocaleString()}</span>
                            </div>
                            <div className="toybox-summary-row">
                                <span>Shipping</span>
                                <span className="toybox-free">FREE</span>
                            </div>
                            <div className="toybox-summary-divider" />
                            <div className="toybox-summary-row toybox-summary-total">
                                <span>Total</span>
                                <span>₹{totalPrice.toLocaleString()}</span>
                            </div>
                            <button className="checkout-btn" onClick={() => navigate("/Checkout")}>
                                Proceed to Checkout →
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
}

export default ToyBox;
