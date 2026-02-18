import "./CheckoutForm.css";
import { useNavigate } from "react-router-dom";
import returnicon from "../../assets/return-icon.svg";

function CheckoutForm() {
    const navigate = useNavigate();

    const handleReturnToCart = () => {
        navigate("/Order");
    };
    
    return (
        <section className="checkout-section">
            <div className="checkout-wrapper">
                <div className="checkout-form">
                    <h2>Checkout</h2>
                    <div className="contact-info">
                        <p>Contact Information</p>
                        <div className="form-row">
                            <input type="email" placeholder="Email"/>
                            <input type="tel" placeholder="Phone number"/>
                        </div>
                    </div>
                    <div className="shipping-address">
                        <p>Shipping Address</p>
                        <div className="form-row">
                            <input type="text" placeholder="First name"/>
                            <input type="text" placeholder="Last name"/>
                        </div>
                        <input type="text" placeholder="Company(optional)"/>
                        <input type="text" placeholder="Address"/>
                        <input type="text" placeholder="Suburb"/>
                        <div className="form-row">
                            <select>
                                <option>Country / region</option>
                                <option></option>
                            </select>
                            <select>
                                <option>State / territory</option>
                                <option></option>
                            </select>
                            <input type="text" placeholder="Postcode"/>
                        </div>
                    </div>
                    <div className="buttons">
                        <button onClick={handleReturnToCart} className="btn-return"><img src={returnicon} alt="return icon" className="return-icon"/><span>Return to cart</span></button>
                        <a href="#" className="btn-continue">Continue to shipping</a>
                    </div>
                </div>
                <div className="order-summary">
                    <div className="order-items">
                        <div className="order-item">
                            <img src="/images/product1-img.png" alt="product"/>
                            <div className="item-details">
                                <p className="item-name">VTech Toot-Toot Drivers Garage Playset</p>
                                <p className="item-price">$12</p>
                            </div>
                        </div>
                        <div className="order-item">
                            <img src="/images/product1-img.png" alt="product"/>
                            <div className="item-details">
                                <p className="item-name">Toy Story Mr Potato Head</p>
                                <p className="item-price">$10</p>
                            </div>
                        </div>
                        <div className="order-item">
                            <img src="/images/product1-img.png" alt="product"/>
                            <div className="item-details">
                                <p className="item-name">Hape Penguin Music Wobbler</p>
                                <p className="item-price">$4</p>
                            </div>
                        </div>
                    </div>
                    <div className="order-total">
                        <div className="total-row">
                            <span>Total</span>
                            <span className="total-amount">$26</span>
                        </div>
                        <p className="total-tax">Including $3.10 in taxes</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CheckoutForm;
