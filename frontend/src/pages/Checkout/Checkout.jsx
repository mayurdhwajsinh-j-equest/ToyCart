import "./Checkout.css";
import productsData from "../../products.json";
import Productcard from "../../components/Productcard/Productcard.jsx";
import Actioncard from "../../components/Actioncard/Actioncard.jsx";
import returnicon from "../../assets/return-icon.svg";

function Checkout() {
    
    return (
        <>
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
                            <a href="#" className="btn-return"><img src={returnicon} alt="return icon" className="return-icon"/><span>Return to cart</span></a>
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
            <section className="moreToys-section">
                <div className="moreToys-content">
                    <h4>More toys for you</h4>
                    {productsData.map((product) => (
                        <Productcard
                            key={product.id}
                            id={product.id}
                            ProductImage={product.ProductImage}
                            ProductName={product.ProductName}
                            Price={product.Price}
                        />
                    ))}
                </div>
            </section>

            <section className="checkout-actions">
                <Actioncard
                    title="Buy toys new from our marketplace"
                    text="Nam leo porttitor sit aliquam in lobortis vitae consequat. Massa purus orci volutpat duis parturient. Ut nunc id bibendum."
                    button="Marketplace"
                    variant="yellow"
                />

                <Actioncard
                    title="Sell toys back to our Whirli collection"
                    text="Placerat sollicitudin faucibus egestas viverra, cursus nascetur fermentum nam. Massa egestas arcu blandit a. Suspendisse lectus orci."
                    button="Sell toys"
                    variant="white"
                />

                <Actioncard
                    title="Gift toys or a Whirli subscription"
                    text="Porta sit id aliquam in lobortis vitae consequat. Massa purus orci volutpat duis parturient. Ut nunc id bibendum."
                    button="Gifting"
                    variant="pink"
                />
            </section>
        </>
    );
}

export default Checkout;