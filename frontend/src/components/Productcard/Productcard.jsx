import "./Productcard.css";
import wishlisticon from "../../assets/wishlist-icon.svg";
import coin from "../../assets/coin-icon.svg";

function Productcard({ ProductImage, ProductName, Price }) {
    return (
        <div className="product-card">
            <div className="product-card__top">
                <div className="product-card__top-first">
                    <p className="badge">NEW IN</p>
                    <img src={wishlisticon} alt="wishlist icon" className="wishlist-icon" />
                </div>
                <div className="product-card__top-second">
                    <img src={ProductImage} alt={ProductName} className="product-img" />
                    <a href="#" className="addToToybox">Add to toybox</a>
                </div>
            </div>
            <div className="product-card__bottom">
                <p className="product-name">{ProductName}</p>
                <img src="/images/review-star.png" alt="review star" className="review-star" />
                <p className="product-price">
                    <span><img src={coin} alt="coin icon" className="coin-icon" /></span>
                    {Price}
                </p>
            </div>
        </div>
    );
}

export default Productcard;
