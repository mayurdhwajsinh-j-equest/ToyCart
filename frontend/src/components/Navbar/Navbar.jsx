import { Link } from "react-router-dom";
import "./Navbar.css";
import searchIcon from "../../assets/search-icon.svg";
import cartIcon from "../../assets/cart-icon.svg";

function Navbar() {
    return (
        <header className="navbar-wrapper">
            <div className="top-bar">
                <span>♻️ Sustainable way to play</span>
                <span>📦 Sell toys back to earn credit</span>
                <span>🎁 20% off first box — NEWPLAYER20</span>
            </div>

            <nav className="navbar">
                <div className="nav-left">
                    <Link to="/" className="logo">
                        <img src="../../public/images/toycart-logo.png" alt="toycart logo" className="toycart-logo"/>
                    </Link>
                </div>
                <ul className="nav-center">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/Alltoys">Alltoys</Link></li>
                    <li><Link to="/Pdp">PDP</Link></li>
                </ul>
                <div className="nav-right">
                    <button className="icon-btn">
                        <img src={searchIcon} alt="Search" />
                    </button>

                    <button className="icon-btn">
                        <img src={cartIcon} alt="Cart" />
                    </button>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
