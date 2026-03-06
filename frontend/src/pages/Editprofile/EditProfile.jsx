import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";
import APIService from "../../services/api";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function EditProfile() {
    const navigate = useNavigate();
    const token = typeof window !== "undefined" ? localStorage.getItem("customerToken") : null;
    const fileRef = useRef(null);

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Profile form
    const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", state: "", zipcode: "" });
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState("");
    const [saveErr, setSaveErr] = useState("");

    // Password form
    const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [pwSaving, setPwSaving] = useState(false);
    const [pwMsg, setPwMsg] = useState("");
    const [pwErr, setPwErr] = useState("");

    // Avatar
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [avatarErr, setAvatarErr] = useState("");

    useEffect(() => {
        if (!token) { navigate("/login"); return; }
        loadProfile();
    }, [token]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await APIService.getProfile(token);
            const u = data.user;
            setUser(u);
            setForm({
                name: u.name || "",
                phone: u.phone || "",
                address: u.address || "",
                city: u.city || "",
                state: u.state || "",
                zipcode: u.zipcode || "",
            });
            if (u.avatar) setAvatarPreview(`${API_BASE}${u.avatar}`);
        } catch {
            navigate("/login");
        } finally {
            setLoading(false);
        }
    };

    const handleFormChange = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true); setSaveMsg(""); setSaveErr("");
        try {
            await APIService.updateProfile(form, token);
            setSaveMsg("Profile updated successfully!");
            // Update navbar name by reloading user
            await loadProfile();
        } catch (err) {
            setSaveErr(err.message || "Unable to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const handlePwChange = (field) => (e) =>
        setPwForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPwSaving(true); setPwMsg(""); setPwErr("");
        try {
            await APIService.changePassword(pwForm, token);
            setPwMsg("Password changed successfully!");
            setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            setPwErr(err.message || "Unable to change password.");
        } finally {
            setPwSaving(false);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAvatarErr("");

        // Preview immediately
        const reader = new FileReader();
        reader.onload = (ev) => setAvatarPreview(ev.target.result);
        reader.readAsDataURL(file);

        // Upload
        try {
            setAvatarUploading(true);
            const data = await APIService.uploadAvatar(file, token);
            setAvatarPreview(`${API_BASE}${data.avatar}`);
            // Tell navbar to re-fetch profile
            window.dispatchEvent(new Event("profileUpdated"));
        } catch (err) {
            setAvatarErr(err.message || "Unable to upload image.");
        } finally {
            setAvatarUploading(false);
        }
    };

    if (loading) return (
        <div className="ep-loading">
            <div className="ep-spinner" />
            <p>Loading profile...</p>
        </div>
    );

    const initials = user?.name?.charAt(0)?.toUpperCase() || "U";

    return (
        <div className="ep-page">
            <div className="ep-container">

                {/* ── Left: Avatar card ── */}
                <div className="ep-avatar-card">
                    <div className="ep-avatar-wrap">
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt={user?.name}
                                className="ep-avatar-img"
                            />
                        ) : (
                            <div className="ep-avatar-initials">{initials}</div>
                        )}
                        {avatarUploading && <div className="ep-avatar-overlay">Uploading...</div>}
                    </div>

                    <button className="ep-change-photo-btn" onClick={() => fileRef.current?.click()}>
                        📷 Change Photo
                    </button>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleAvatarChange}
                    />
                    {avatarErr && <p className="ep-error">{avatarErr}</p>}

                    <div className="ep-user-info">
                        <p className="ep-user-name">{user?.name}</p>
                        <p className="ep-user-email">{user?.email}</p>
                        <span className="ep-user-role">{user?.role}</span>
                    </div>
                </div>

                {/* ── Right: Forms ── */}
                <div className="ep-forms">

                    {/* Profile form */}
                    <div className="ep-form-card">
                        <h2 className="ep-form-title">Edit Profile</h2>

                        {saveMsg && <p className="ep-success">{saveMsg}</p>}
                        {saveErr && <p className="ep-error">{saveErr}</p>}

                        <form onSubmit={handleSaveProfile} className="ep-form">
                            <div className="ep-form-row">
                                <div className="ep-form-group">
                                    <label>Full Name</label>
                                    <input type="text" value={form.name} onChange={handleFormChange("name")} placeholder="Your name" required />
                                </div>
                                <div className="ep-form-group">
                                    <label>Phone</label>
                                    <input type="tel" value={form.phone} onChange={handleFormChange("phone")} placeholder="9876543210" />
                                </div>
                            </div>
                            <div className="ep-form-group">
                                <label>Address</label>
                                <input type="text" value={form.address} onChange={handleFormChange("address")} placeholder="Street address" />
                            </div>
                            <div className="ep-form-row">
                                <div className="ep-form-group">
                                    <label>City</label>
                                    <input type="text" value={form.city} onChange={handleFormChange("city")} placeholder="City" />
                                </div>
                                <div className="ep-form-group">
                                    <label>State</label>
                                    <input type="text" value={form.state} onChange={handleFormChange("state")} placeholder="State" />
                                </div>
                                <div className="ep-form-group">
                                    <label>Zipcode</label>
                                    <input type="text" value={form.zipcode} onChange={handleFormChange("zipcode")} placeholder="Zipcode" />
                                </div>
                            </div>
                            <button type="submit" className="ep-save-btn" disabled={saving}>
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </form>
                    </div>

                    {/* Password form */}
                    <div className="ep-form-card">
                        <h2 className="ep-form-title">Change Password</h2>

                        {pwMsg && <p className="ep-success">{pwMsg}</p>}
                        {pwErr && <p className="ep-error">{pwErr}</p>}

                        <form onSubmit={handleChangePassword} className="ep-form">
                            <div className="ep-form-group">
                                <label>Current Password</label>
                                <input type="password" value={pwForm.currentPassword} onChange={handlePwChange("currentPassword")} placeholder="••••••••" required />
                            </div>
                            <div className="ep-form-row">
                                <div className="ep-form-group">
                                    <label>New Password</label>
                                    <input type="password" value={pwForm.newPassword} onChange={handlePwChange("newPassword")} placeholder="••••••••" required />
                                </div>
                                <div className="ep-form-group">
                                    <label>Confirm New Password</label>
                                    <input type="password" value={pwForm.confirmPassword} onChange={handlePwChange("confirmPassword")} placeholder="••••••••" required />
                                </div>
                            </div>
                            <button type="submit" className="ep-save-btn ep-save-btn--pw" disabled={pwSaving}>
                                {pwSaving ? "Updating..." : "Update Password"}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
