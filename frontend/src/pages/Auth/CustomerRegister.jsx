import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import APIService from "../../services/api";
import "../Admin/Admin.css";

const CustomerRegister = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await APIService.register({
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      setSuccess("Account created! You can now sign in.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err.message || "Unable to register.");
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
        <p className="admin-login-sub">Create your ToyCart account</p>

        {error && <div className="admin-error-msg">{error}</div>}
        {success && <div className="admin-error-msg" style={{ background: "#dcfce7", borderColor: "#27a06a", color: "#166534" }}>{success}</div>}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label>Full name</label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="Your name"
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={handleChange("password")}
              placeholder="••••••••"
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Confirm password</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="admin-login-hint">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerRegister;

