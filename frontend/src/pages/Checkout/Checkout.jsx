import "./Checkout.css";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import CheckoutForm from "../../components/CheckoutForm/CheckoutForm.jsx";
import Actioncard from "../../components/Actioncard/Actioncard.jsx";
import Productcard from "../../components/Productcard/Productcard.jsx";
import APIService from "../../services/api";
import navprev from "../../assets/nav-prev.svg";
import navnext from "../../assets/nav-next.svg";

function Checkout() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Sync cart when component mounts (in case it was cleared during checkout)
        const handleCartUpdated = () => {
            // This will trigger a re-render which shows updated cart
        };
        window.addEventListener("cartUpdated", handleCartUpdated);
        return () => window.removeEventListener("cartUpdated", handleCartUpdated);
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await APIService.getProducts();
                const list = Array.isArray(data) ? data : (data.products || []);
                setProducts(list);
            } catch (err) {
                // Failed to load products
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <>
            <CheckoutForm />

            <section className="moreToys-section">
                <div className="moreToys-content">
                    <div className="section-heading">
                        <h4>More toys for you</h4>
                        <div className="heading-actions">
                            <a href="/Alltoys" className="see-all-btn">See all toys</a>
                            <button className="nav-btn nav-prev checkout-prev-btn" aria-label="Previous products" data-tooltip="Previous">
                                <img src={navprev} alt="nav prev" />
                            </button>
                            <button className="nav-btn nav-next checkout-next-btn" aria-label="Next products" data-tooltip="Next">
                                <img src={navnext} alt="nav next" />
                            </button>
                        </div>
                    </div>

                    {loading && (
                        <div className="slider-loading">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="skeleton-card" />
                            ))}
                        </div>
                    )}

                    {!loading && products.length > 0 && (
                        <Swiper
                            spaceBetween={10}
                            slidesPerView={5}
                            navigation={{
                                prevEl: ".checkout-prev-btn",
                                nextEl: ".checkout-next-btn",
                            }}
                            modules={[Navigation]}
                            className="checkout-swiper"
                        >
                            {products.map((product) => (
                                <SwiperSlide key={product.id}>
                                    <Productcard
                                        id={product.id}
                                        ProductImage={
                                            product.image_url
                                                ? product.image_url.startsWith("/uploads")
                                                    ? `http://localhost:5000${product.image_url}`
                                                    : product.image_url
                                                : product.ProductImage
                                        }
                                        ProductName={product.name || product.ProductName}
                                        Price={product.price || product.Price}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}

                    {!loading && products.length === 0 && (
                        <p className="no-products">No products available right now.</p>
                    )}
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