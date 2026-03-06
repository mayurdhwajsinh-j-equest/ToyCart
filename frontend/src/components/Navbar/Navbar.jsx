import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import cartIcon from "../../assets/cart-icon.svg";
import { useCart } from "../../hooks/useCart";
import { useEffect, useState } from "react";
import APIService from "../../services/api";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Navbar() {
    const { getCartCount } = useCart();
    const navigate = useNavigate();
    const cartCount = getCartCount();

    const token = typeof window !== "undefined" ? localStorage.getItem("customerToken") : null;
    const isLoggedIn = !!token;

    const [userName, setUserName] = useState("");
    const [userAvatar, setUserAvatar] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) { setUserName(""); setUserAvatar(null); return; }
        const fetchProfile = () => {
            APIService.getProfile(token)
                .then((data) => {
                    setUserName(data?.user?.name || "User");
                    setUserAvatar(data?.user?.avatar || null);
                })
                .catch(() => setUserName("User"));
        };
        fetchProfile();
        window.addEventListener("profileUpdated", fetchProfile);
        return () => window.removeEventListener("profileUpdated", fetchProfile);
    }, [isLoggedIn, token]);

    const handleLogout = () => {
        localStorage.removeItem("customerToken");
        setUserName("");
        setUserAvatar(null);
        setDropdownOpen(false);
        navigate("/");
        window.location.reload();
    };

    const avatarSrc = userAvatar
        ? (userAvatar.startsWith("http") ? userAvatar : `${API_BASE}${userAvatar}`)
        : null;

    return (
        <header className="navbar-wrapper">
            {/* Scrolling top bar */}
            <div className="top-bar">
                <div className="top-bar-content">
                    <span>♻️ Sustainable way to play</span>
                    <span>📦 Sell toys back to earn credit</span>
                    <span>🎁 20% off first box — NEWPLAYER20</span>
                    <span>🌍 The most sustainable toy store</span>
                    <span>♻️ Sustainable way to play</span>
                    <span>📦 Sell toys back to earn credit</span>
                    <span>🎁 20% off first box — NEWPLAYER20</span>
                    <span>🌍 The most sustainable toy store</span>
                </div>
            </div>

            <nav className="navbar">
                {/* Logo */}
                <div className="nav-left">
                    <Link to="/" className="logo">
                        <img src="../../public/images/toycart-logo.png" alt="ToyCart" className="toycart-logo" />
                    </Link>
                </div>

                {/* Nav links */}
                <ul className="nav-center">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/Alltoys">Product</Link></li>
                    <li><Link to="/Order">Order</Link></li>
                    <li><Link to="/About">About</Link></li>
                </ul>

                {/* Right side actions */}
                <div className="nav-right">
                    {/* Cart */}
                    <button className="icon-btn cart-btn" onClick={() => navigate("/Order")} title="Cart">
                        <img src={cartIcon} alt="Cart" />
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </button>

                    {isLoggedIn ? (
                        <div className="nav-user" onClick={() => setDropdownOpen((p) => !p)}>
                            {/* Avatar: image or initials */}
                            <div className="nav-avatar" title={userName}>
                                {avatarSrc ? (
                                    <img src={avatarSrc} alt={userName} className="nav-avatar-img" />
                                ) : (
                                    userName.charAt(0).toUpperCase() || "U"
                                )}
                            </div>
                            <span className="nav-username">{userName.split(" ")[0]}</span>
                            <span className="nav-chevron">{dropdownOpen ? "▲" : "▼"}</span>

                            {dropdownOpen && (
                                <div className="nav-dropdown" onClick={(e) => e.stopPropagation()}>
                                    <div className="nav-dropdown-header">
                                        <div className="nav-avatar large">
                                            {avatarSrc ? (
                                                <img src={avatarSrc} alt={userName} className="nav-avatar-img" />
                                            ) : (
                                                userName.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <p className="nav-dropdown-name">{userName}</p>
                                        </div>
                                    </div>
                                    <hr className="nav-dropdown-divider" />
                                    <button className="nav-dropdown-item" onClick={() => { navigate("/profile/edit"); setDropdownOpen(false); }}>
                                        ✏️ Edit Profile
                                    </button>
                                    <hr className="nav-dropdown-divider" />
                                    <button className="nav-dropdown-item" onClick={() => { navigate("/my-orders"); setDropdownOpen(false); }}>
                                        📦 My Orders
                                    </button>
                                    <hr className="nav-dropdown-divider" />
                                    <button className="nav-dropdown-item" onClick={() => { navigate("/wishlist"); setDropdownOpen(false); }}>
                                        ♥ My Wishlist
                                    </button>
                                    <hr className="nav-dropdown-divider" />
                                    <button className="nav-dropdown-item logout" onClick={handleLogout}>
                                        🚪 Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className="login-btn" onClick={() => navigate("/login")}>
                            <span className="login-btn-icon">👤</span>
                            Login
                        </button>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
