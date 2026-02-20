import "./ToyBox.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";

function ToyBox() {
    const navigate = useNavigate();
    const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart();

    const handleQuantityChange = (id, change) => {
        const item = cartItems.find(item => item.id === id);
        if (item) {
            updateQuantity(id, item.quantity + change);
        }
    };

    return (
        <section className="toybox-section">
            <div className="toybox-content">
                <h2>Your toy box</h2>
                <table className="toybox-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#255F83' }}>
                                    Your cart is empty. <a href="/Alltoys" style={{ color: '#255F83', fontWeight: 'bold' }}>Continue shopping</a>
                                </td>
                            </tr>
                        ) : (
                            cartItems.map((item) => (
                                <tr key={item.id}>
                                    <td className="product-cell">
                                        <img src={item.ProductImage} alt={item.ProductName} className="product-image" />
                                        <span className="product-name">{item.ProductName}</span>
                                    </td>
                                    <td className="price-cell">${item.Price}</td>
                                    <td className="quantity-cell">
                                        <button
                                            className="qty-btn qty-minus"
                                            onClick={() => handleQuantityChange(item.id, -1)}
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            readOnly
                                            className="qty-input"
                                        />
                                        <button
                                            className="qty-btn qty-plus"
                                            onClick={() => handleQuantityChange(item.id, 1)}
                                        >
                                            +
                                        </button>
                                    </td>
                                    <td className="action-cell">
                                        <button 
                                            className="add-to-cart-btn" 
                                            onClick={() => removeFromCart(item.id)}
                                            style={{ background: '#FF6B6B' }}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className="checkout-btn-wrapper">
                    <button className="checkout-btn" onClick={() => navigate("/Checkout")}>Check Out Now</button>
                </div>
            </div>
        </section>
    );
}

export default ToyBox;
