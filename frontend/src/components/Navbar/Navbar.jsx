import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import cartIcon from "../../assets/cart-icon.svg";
import { useCart } from "../../hooks/useCart";
import { useEffect, useState } from "react";
import APIService from "../../services/api";

function Navbar() {
    const { getCartCount } = useCart();
    const navigate = useNavigate();
    const cartCount = getCartCount();

    const token = typeof window !== "undefined" ? localStorage.getItem("customerToken") : null;
    const isLoggedIn = !!token;

    const [userName, setUserName] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Fetch logged-in user's name from backend
    useEffect(() => {
        if (!isLoggedIn) { setUserName(""); return; }
        APIService.getProfile(token)
            .then((data) => setUserName(data?.user?.name || "User"))
            .catch(() => setUserName("User"));
    }, [isLoggedIn, token]);

    const handleLogout = () => {
        localStorage.removeItem("customerToken");
        setUserName("");
        setDropdownOpen(false);
        navigate("/");
        window.location.reload();
    };

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
                        /* User avatar + dropdown */
                        <div className="nav-user" onClick={() => setDropdownOpen((p) => !p)}>
                            <div className="nav-avatar" title={userName}>
                                {userName.charAt(0).toUpperCase() || "U"}
                            </div>
                            <span className="nav-username">{userName.split(" ")[0]}</span>
                            <span className="nav-chevron">{dropdownOpen ? "▲" : "▼"}</span>

                            {dropdownOpen && (
                                <div className="nav-dropdown" onClick={(e) => e.stopPropagation()}>
                                    <div className="nav-dropdown-header">
                                        <div className="nav-avatar large">{userName.charAt(0).toUpperCase()}</div>
                                        <div>
                                            <p className="nav-dropdown-name">{userName}</p>
                                        </div>
                                    </div>
                                    <hr className="nav-dropdown-divider" />
                                    <button className="nav-dropdown-item" onClick={() => { navigate("/my-orders"); setDropdownOpen(false); }}>
                                        📦 My Orders
                                    </button>
                                    <hr className="nav-dropdown-divider" />
                                    <button className="nav-dropdown-item logout" onClick={handleLogout}>
                                        🚪 Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Login button */
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
