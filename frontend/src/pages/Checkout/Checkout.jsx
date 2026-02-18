import "./Checkout.css";
import productsData from "../../products.json";
import Productcard from "../../components/Productcard/Productcard.jsx";
import Actioncard from "../../components/Actioncard/Actioncard.jsx";
import CheckoutForm from "../../components/CheckoutForm/CheckoutForm.jsx";

function Checkout() {
    
    return (
        <>
            <CheckoutForm />
            <section className="moreToys-section">
                <div className="moreToys-content">
                    <div className="section-heading">
                        <h4>More toys for you</h4>
                        <div className="heading-actions">
                            <a href="#" className="see-all-btn">See all toys</a>
                            <button className="nav-btn nav-prev">←</button>
                            <button className="nav-btn nav-next">→</button>
                        </div>
                    </div>
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