import "./ToyBox.css";
import { useState } from "react";

function ToyBox() {
    const [items, setItems] = useState([
        {
            id: 1,
            image: "/images/product1-img.png",
            name: "VTech Toot-Toot Drivers Garage Playset",
            price: 12,
            quantity: 1
        },
        {
            id: 2,
            image: "/images/product1-img.png",
            name: "Toy Story Mr Potato Head",
            price: 10,
            quantity: 1
        },
        {
            id: 3,
            image: "/images/product1-img.png",
            name: "Hape Penguin Music Wobbler",
            price: 4,
            quantity: 1
        }
    ]);

    const handleQuantityChange = (id, change) => {
        setItems(items.map(item =>
            item.id === id
                ? { ...item, quantity: Math.max(1, item.quantity + change) }
                : item
        ));
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
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td className="product-cell">
                                    <img src={item.image} alt={item.name} className="product-image" />
                                    <span className="product-name">{item.name}</span>
                                </td>
                                <td className="price-cell">${item.price}</td>
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
                                    <button className="add-to-cart-btn">Add to Cart</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="checkout-btn-wrapper">
                    <button className="checkout-btn">Check Out Now</button>
                </div>
            </div>
        </section>
    );
}

export default ToyBox;
