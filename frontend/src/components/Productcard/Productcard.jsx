import { Link, useNavigate } from "react-router-dom";
import "./Productcard.css";
import wishlisticon from "../../assets/wishlist-icon.svg";
import coin from "../../assets/coin-icon.svg";

function Productcard({ id, ProductImage, ProductName, Price }) {
    const navigate = useNavigate();

    const handleAddToToybox = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate("/Order");
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
                        <img src={ProductImage} alt={ProductName} className="product-img" />
                        <button className="addToToybox" onClick={handleAddToToybox}>Add to toybox</button>
                    </div>
                </div>
                <div className="product-card__bottom">
                    <p className="product-name">{ProductName}</p>
                    <img src="/images/review-star.png" alt="review star" className="reviewstar" />
                    <p className="product-price">
                        <span><img src={coin} alt="coin icon" className="coin-icon" /></span>
                        {Price}
                    </p>
                </div>
            </div>
        </Link>
    );
}

export default Productcard;
