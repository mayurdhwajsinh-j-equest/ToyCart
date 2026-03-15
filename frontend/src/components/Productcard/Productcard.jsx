import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Productcard.css";
import coin from "../../assets/coin-icon.svg";
import APIService from "../../services/api";
import { useCart } from "../../hooks/useCart";

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

function Productcard({ id, ProductImage, ProductName, Price, rating = 0, reviewCount = 0, isNew = false }) {
    const token = typeof window !== "undefined" ? localStorage.getItem("customerToken") : null;
    const { addToCart } = useCart();

    const [wishlisted, setWishlisted] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        if (!token || !id) return;
        APIService.checkWishlist(id, token)
            .then((data) => setWishlisted(data?.inWishlist || false))
            .catch(() => { });
    }, [id, token]);

    const handleAddToToybox = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!token) {
            window.location.href = "/login";
            return;
        }

        try {
            setAddingToCart(true);
            await addToCart({ id });
            setAddedToCart(true);
            
            // Show success state for 2 seconds
            setTimeout(() => {
                setAddedToCart(false);
            }, 2000);
        } catch (err) {
            // Failed to add to cart
        } finally {
            setAddingToCart(false);
        }
    };

    const handleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!token) { window.location.href = "/login"; return; }
        if (wishlistLoading) return;
        try {
            setWishlistLoading(true);
            if (wishlisted) {
                await APIService.removeFromWishlist(id, token);
                setWishlisted(false);
            } else {
                await APIService.addToWishlist(id, token);
                setWishlisted(true);
            }
        } catch {
            // silent fail
        } finally {
            setWishlistLoading(false);
        }
    };

    const getImageUrl = (path) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;
        return `${API_URL}${path}`;
    };

    return (
        <Link to={`/Pdp/${id}`} className="product-card-link">
            <div className="product-card">
                {/* Image area — badge + wishlist sit inside here as absolute */}
                <div className="product-card__top-second">
                    {isNew && <span className="badge">NEW IN</span>}
                    <button
                        className={`wishlist-btn ${wishlisted ? "wishlist-btn--active" : ""}`}
                        onClick={handleWishlist}
                        disabled={wishlistLoading}
                        title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        {wishlisted ? "♥" : "♡"}
                    </button>
                    <img
                        src={getImageUrl(ProductImage)}
                        alt={ProductName}
                        className="product-img"
                    />
                    <button 
                        className={`addToToybox ${addingToCart ? 'adding' : ''} ${addedToCart ? 'added' : ''}`} 
                        onClick={handleAddToToybox}
                        disabled={addingToCart || addedToCart}
                    >
                        {addingToCart ? "Adding..." : addedToCart ? "✓ Added!" : "Add to toybox"}
                    </button>
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

export function SkeletonCard() {
    return (
        <div className="product-card skeleton-card">
            <div className="product-card__top-second">
                <div className="skeleton skeleton-img" />
            </div>
            <div className="product-card__bottom">
                <div className="skeleton skeleton-name" />
                <div className="skeleton skeleton-stars" />
                <div className="skeleton skeleton-price" />
            </div>
        </div>
    );
}

export default Productcard;
