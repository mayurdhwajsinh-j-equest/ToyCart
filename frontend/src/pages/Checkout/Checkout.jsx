import "./Checkout.css";
import productsData from "../../products.json";
import Productcard from "../../components/Productcard/Productcard.jsx";
import Actioncard from "../../components/Actioncard/Actioncard.jsx";

function Checkout() {
    
    return (
        <>
            <section className="checkout-section">
                <div className="checkout-content">
                    <h2>Checkout</h2>
                    <div className="contact-info">
                        <p>Contact Information</p>
                        <input type="email" placeholder="Email"/>
                        <input type="number" placeholder="Phone number"/>
                    </div>
                    <div className="shipping-address">
                        <p>Shipping Address</p>
                    </div>
                    <div></div>
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