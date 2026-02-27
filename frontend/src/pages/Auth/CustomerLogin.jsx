import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import APIService from "../../services/api";
import "../Admin/Admin.css";

const CustomerLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await APIService.login(form.email, form.password);
      if (data?.user?.role !== "customer" && data?.user?.role !== "admin") {
        setError("Invalid user role.");
        setLoading(false);
        return;
      }
      localStorage.setItem("customerToken", data.token);
      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-bg">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <span className="logo-icon">🧸</span>
          <h1>ToyCart</h1>
        </div>
        <p className="admin-login-sub">Sign in to your ToyCart account</p>

        {error && <div className="admin-error-msg">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange("email")}
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange("password")}
              required
            />
          </div>
          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="admin-login-hint">
          New here? <Link to="/register">Create a ToyCart account</Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerLogin;

