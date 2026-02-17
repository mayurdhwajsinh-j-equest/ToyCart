import "./Pdp.css";
import slideBaby from "../../../public/images/slideBaby-big.png";
import small1 from "../../../public/images/small-img1.png";
import toy2img from "../../../public/images/toy2-img.png";
import toy2img1 from "../../../public/images/toy2-img1.png";
import toy2img2 from "../../../public/images/toy2-img2.png";
import toy2img3 from "../../../public/images/toy2-img3.png";
import toy2img4 from "../../../public/images/toy2-img4.png";
import Textbox from "../../components/Textbox/Textbox.jsx";
import earth from "../../../public/images/earth.png";
import arrow from "../../assets/arrow.svg";
import coin from "../../assets/coin.svg";
import union from "../../assets/Union.svg";
import stacktoy from "../../assets/Stacktoy.svg";
import earth1 from "../../assets/earth.svg";
import review4star from "../../../public/images/review-4star.png";
import line from "../../../public/images/horizontal-line.png";
import threecar from "../../../public/images/3car.png";
import ProductDescription from "../../components/Productdescription/Productdescription.jsx";

function Pdp() {

    const productData = {
        title: "VTech Toot-Toot Drivers Garage Playset",
        price: 88,
        mainImage: toy2img,
        images: [toy2img4, toy2img3, toy2img2, toy2img1],
        ratingImage: review4star,
        description:
            "Vel diam a lobortis rhoncus nunc adipiscing habitant vitae. Scelerisque condimentum in vulputate condimentum sollicitudin. Libero vel placerat dictumst a praesent neque et.",
        coinIcon: coin,
        lineIcon: line,
        details: [
            {
                icon: union,
                title: "Age recommendation",
                value: "1 year - 3 years",
            },
            {
                icon: stacktoy,
                title: "Skills & Learning",
                value: "Helps with independent play and sensory learning",
            },
            {
                icon: earth1,
                title: "Toy impact",
                value: "Lorem ipsum dolor sit",
            },
        ],
    };
    return (
        <>
            <section className="hero-section">
                <div className="hero-section__content">
                    <p className="hero-section__top-text">
                        Brows toys
                        <span><img src={arrow} alt="arrow icon" className="arrow-icon" /></span>
                        All toys
                        <span><img src={arrow} alt="arrow icon" className="arrow-icon" /></span>
                        VTech toot-toot drivers...
                    </p>
                    {/* <div className="product-description">
                        <div className="product-description__images">
                            <img src={toy2img} alt="toy2 img" className="toy2-img" />
                            <div className="product-description__images-top">
                            </div>
                            <div className="product-description__images-bottom">
                                <img src={toy2img4} alt="toy2 sub img" className="toy2-img4" />
                                <img src={toy2img3} alt="toy2 sub img" className="toy2-img3" />
                                <img src={toy2img2} alt="toy2 sub img" className="toy2-img2" />
                                <img src={toy2img1} alt="toy2 sub img" className="toy2-img1" />
                            </div>
                        </div>
                        <div className="product-description__content">
                            <div>
                                <h2 className="product-description__content-title">VTech Toot-Toot Drivers Garage Playset</h2>
                                <p className="product-description__content-price"><span><img src={coin} alt="coin icon" className="coin icon" /></span>88</p>
                                <img src={review4star} alt="review 4 star" className="review-4star" />
                                <p className="product-description__content-text">Vel diam a lobortis rhoncus nunc adipiscing habitant vitae. Scelerisque condimentum in vulputate condimentum sollicitudin. Libero vel placerat dictumst a praesent neque et.</p>
                                <img src={line} alt="line" className="line" />
                                <a href="#" className="addToCart">Add to cart</a>
                                <img src={line} alt="line" className="" />
                            </div>
                            <div className="product-details">

                                <div className="product-details__item">
                                    <div className="product-details__icon">
                                        <img src={union} alt="union icon" />
                                    </div>
                                    <div className="product-details__text">
                                        <p className="product-details__title">Age recommendation</p>
                                        <p className="product-details__desc">1 year - 3 years</p>
                                    </div>
                                </div>

                                <img src={line} alt="line" className="" />
                                <div className="product-details__item">
                                    <div className="product-details__icon">
                                        <img src={stacktoy} alt="stack toy icon" />
                                    </div>
                                    <div className="product-details__text">
                                        <p className="product-details__title">Skills & Learning</p>
                                        <p className="product-details__desc">
                                            Helps with independent play and sensory learning
                                        </p>
                                    </div>

                                </div>
                                <img src={line} alt="line" className="" />

                                <div className="product-details__item">
                                    <div className="product-details__icon">
                                        <img src={earth1} alt="earth icon" />
                                    </div>
                                    <div className="product-details__text">
                                        <p className="product-details__title">Toy impact</p>
                                        <p className="product-details__desc">Lorem ipsum dolor sit</p>
                                    </div>
                                </div>
                                <img src={line} alt="line" className="" />

                            </div>

                        </div>
                    </div> */}
                    <ProductDescription product={productData} />
                </div>
                    <section className="pdp-featured-section">
                        <h1 className="pdp-featured-section__h1">The features</h1>
                        <ul className="pdp-featured-items">
                            <li className="pdp-featured-item"><a href="#">Lorem ipsim</a></li>
                            <li className="pdp-featured-item"><a href="#">Vehicles</a></li>
                            <li className="pdp-featured-item"><a href="#">Automation</a></li>
                            <li className="pdp-featured-item"><a href="#">Easy to store</a></li>
                            <li className="pdp-featured-item"><a href="#">Dolor sit</a></li>
                        </ul>
                        <div className="pdp-featured-section__bottom">
                            <div className="pdp-featured-section__bottom-left">
                                <img src={threecar} alt="3 car image" className="three-car" />
                            </div>
                            <div className="pdp-featured-section__bottom-right">
                                <h1 className="pdp-featured-section__bottom-right-h1">Three vehicles included</h1>
                                <p>Nam leo porta sit id aliquam in lobortis vitae consequat. Massa purus orci volutpat duis parturient. Ut nunc id bibendum.</p>
                                <p>Massa egestas arcu blandit a. Suspendisse lectus id consequat sapien sit lorem.</p>
                                <a href="#" className="add">Add to toy box</a>
                            </div>
                        </div>
                    </section>
            </section>
            <section className="pdp-sustainability-section">
                <div className="pdp-sustainability-content">
                    <div className="pdp-sustainability-section__top">
                        <div className="pdp-sustainability-section__top-h2">
                            <h2>This toys saves</h2>
                        </div>
                        <div>
                            <p className="pdp-sustainability-section__top-img">
                                <img src={earth} alt="earth img" className="earth-img" />
                                000,000</p>
                        </div>
                    </div>
                    <div className="pdp-sustainability-section__center">
                        <h2>carbon from the atmosphere</h2>
                    </div>
                    <div className="pdp-sustainability-section__bottom">
                        <p className="pdp-sustainability-section__bottom-p">Elit et libero turpis integer nam neque. Feugiat tellus non arcu vitae eget urna aliquam. Nisl sit eu massa sed mollis tellus commodo. Id at viverra.</p>
                    </div>
                </div>
            </section>
            <section className="pdp-safety-section">
                <div className="safety-content">
                    <div className="safety-image">
                        <img src={slideBaby} alt="Safety1" className="safety-img1" />
                        <img src={small1} alt="Safety2" className="safety-img2" />
                    </div>
                    <div className="safety-text">
                        <Textbox
                            h2text="Sparkling & child-safe, every time."
                            ptext="Massa faucibus cras dignissim convallis donec scelerisque eget placerat sit. Luctus morbi et mi vitae massa mattis velit. Amet dignissim quis diam massa lectus velit non. Faucibus sagittis posuere ultrices."
                            linkText="Read our safety policy"
                            linkHref="#"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}

export default Pdp;