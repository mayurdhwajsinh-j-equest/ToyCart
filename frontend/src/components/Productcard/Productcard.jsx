import { Link } from "react-router-dom";
import "./Productcard.css";
import wishlisticon from "../../assets/wishlist-icon.svg";
import coin from "../../assets/coin-icon.svg";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function StarRating({ rating = 0, count = 0 }) {
    const filled = Math.round(rating);
    return (
        <div className="pc-stars">
            {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={`pc-star ${n <= filled ? "pc-star--filled" : ""}`}>★</span>
            ))}
            {count > 0 && <span className="pc-review-count">({count})</span>}
        </div>
    );
}

function Productcard({ id, ProductImage, ProductName, Price, rating = 0, reviewCount = 0 }) {

    const handleAddToToybox = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = `/Pdp/${id}`;
    };

    const getImageUrl = (path) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;
        return `${API_URL}${path}`;
    };

    return (
        <Link to={`/Pdp/${id}`} className="product-card-link">
            <div className="product-card">
                <div className="product-card__top">
                    <div className="product-card__top-first">
                        <p className="badge">NEW IN</p>
                        <img src={wishlisticon} alt="wishlist icon" className="wishlist-icon" />
                    </div>
                    <div className="product-card__top-second">
                        <img
                            src={getImageUrl(ProductImage)}
                            alt={ProductName}
                            className="product-img"
                        />
                        <button className="addToToybox" onClick={handleAddToToybox}>Add to toybox</button>
                    </div>
                </div>
                <div className="product-card__bottom">
                    <p className="product-name">{ProductName}</p>
                    <StarRating rating={rating} count={reviewCount} />
                    <p className="product-price">
                        <span><img src={coin} alt="coin icon" className="coin-icon" /></span>
                        ₹{Number(Price).toLocaleString()}
                    </p>
                </div>
            </div>
        </Link>
    );
}

export default Productcard;
