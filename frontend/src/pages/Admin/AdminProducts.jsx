import { useState, useEffect, useRef } from "react";
import "./Admin.css";
import APIService from "../../services/api";

const emptyProduct = {
  id: null,
  name: "",
  categoryId: "",
  price: "",
  stock: "",
  image_url: "",
  image: null,
  imagePreview: null,
  description: "",
  short_description: "",
  is_featured: false,
  is_new: false,
};

const emptyGallery = [
  { file: null, preview: null, existing: null },
  { file: null, preview: null, existing: null },
  { file: null, preview: null, existing: null },
];

const AdminProducts = () => {
  const [products,           setProducts]           = useState([]);
  const [categories,         setCategories]         = useState([]);
  const [search,             setSearch]             = useState("");
  const [filterCategory,     setFilterCategory]     = useState("All");
  const [showModal,          setShowModal]          = useState(false);
  const [showCategoryModal,  setShowCategoryModal]  = useState(false);
  const [editingProduct,     setEditingProduct]     = useState(null);
  const [form,               setForm]               = useState(emptyProduct);
  const [gallery,            setGallery]            = useState(emptyGallery);
  const [deleteConfirm,      setDeleteConfirm]      = useState(null);
  const [deleteCatConfirm,   setDeleteCatConfirm]   = useState(null);
  const [loading,            setLoading]            = useState(false);
  const [error,              setError]              = useState("");

  // Category form state
  const [categoryForm,       setCategoryForm]       = useState({ name: "", description: "" });
  const [editingCategory,    setEditingCategory]    = useState(null); // null = adding, id = editing
  const [categoryError,      setCategoryError]      = useState("");
  const [categoryLoading,    setCategoryLoading]    = useState(false);

  const galleryRefs = [useRef(null), useRef(null), useRef(null)];
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `http://localhost:5000${path}`;
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [prodRes, catRes] = await Promise.all([
        APIService.getAdminProducts({}, token),
        APIService.getAdminCategories(token),
      ]);
      setProducts((prodRes.products || []).map((p) => ({
        ...p,
        categoryName: p.Category?.name || "Uncategorized",
      })));
      setCategories((catRes.categories || []).map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description || "",
      })));
    } catch {
      setError("Unable to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "All" || p.categoryId === Number(filterCategory);
    return matchSearch && matchCat;
  });

  // ── Product modal ──
  const openAdd = () => {
    setForm(emptyProduct);
    setGallery(emptyGallery);
    setEditingProduct(null);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      categoryId: product.categoryId,
      price: product.price,
      stock: product.stock,
      image_url: product.image_url,
      image: null,
      imagePreview: product.image_url,
      description: product.description || "",
      short_description: product.short_description || "",
      is_featured: !!product.is_featured,
      is_new: !!product.is_new,
    });
    const existing = Array.isArray(product.additional_images) ? product.additional_images : [];
    setGallery(emptyGallery.map((slot, i) =>
      existing[i] ? { file: null, preview: null, existing: existing[i] } : { file: null, preview: null, existing: null }
    ));
    setEditingProduct(product.id);
    setShowModal(true);
  };

  // ── Category modal helpers ──
  const openCategoryModal = () => {
    setCategoryForm({ name: "", description: "" });
    setEditingCategory(null);
    setCategoryError("");
    setShowCategoryModal(true);
  };

  const startEditCategory = (cat) => {
    setCategoryForm({ name: cat.name, description: cat.description });
    setEditingCategory(cat.id);
    setCategoryError("");
  };

  const cancelEditCategory = () => {
    setCategoryForm({ name: "", description: "" });
    setEditingCategory(null);
    setCategoryError("");
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      setCategoryLoading(true);
      setCategoryError("");
      if (editingCategory) {
        await APIService.updateAdminCategory(editingCategory, {
          name: categoryForm.name,
          description: categoryForm.description,
        }, token);
      } else {
        await APIService.createAdminCategory({
          name: categoryForm.name,
          description: categoryForm.description,
        }, token);
      }
      await loadData();
      setCategoryForm({ name: "", description: "" });
      setEditingCategory(null);
    } catch (err) {
      setCategoryError(err.message || "Unable to save category.");
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      setCategoryLoading(true);
      setCategoryError("");
      await APIService.deleteAdminCategory(id, token);
      await loadData();
    } catch (err) {
      setCategoryError(err.message || "Unable to delete category. It may have products assigned.");
    } finally {
      setDeleteCatConfirm(null);
      setCategoryLoading(false);
    }
  };

  // ── Gallery handlers ──
  const handleGalleryChange = (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Please select an image file."); return; }
    if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5MB."); return; }
    const preview = URL.createObjectURL(file);
    setGallery((prev) => prev.map((slot, i) => i === index ? { file, preview, existing: null } : slot));
  };

  const removeGallerySlot = (index) => {
    setGallery((prev) => prev.map((slot, i) => i === index ? { file: null, preview: null, existing: null } : slot));
    if (galleryRefs[index].current) galleryRefs[index].current.value = "";
  };

  // ── Save product ──
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("price", Number(form.price));
      payload.append("stock", Number(form.stock));
      payload.append("categoryId", Number(form.categoryId));
      payload.append("description", form.description);
      payload.append("short_description", form.short_description);
      payload.append("is_featured", !!form.is_featured);
      payload.append("is_new", form.is_new ? "true" : "false");
      if (form.image instanceof File) payload.append("image", form.image);
      gallery.forEach((slot) => { if (slot.file instanceof File) payload.append("additional_images", slot.file); });
      const keepExisting = gallery.filter((slot) => slot.existing && !slot.file).map((slot) => slot.existing);
      payload.append("keep_additional_images", JSON.stringify(keepExisting));
      if (editingProduct) {
        await APIService.updateProduct(editingProduct, payload, token);
      } else {
        await APIService.createProduct(payload, token);
      }
      await loadData();
      setShowModal(false);
    } catch (err) {
      setError(err.message || "Unable to save product.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      setError("");
      await APIService.deleteProduct(id, token);
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to delete product.");
    } finally {
      setDeleteConfirm(null);
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Products</h2>
        <div className="admin-header-actions">
          <button className="admin-btn-secondary" onClick={openCategoryModal}>🗂 Manage Categories</button>
          <button className="admin-btn-primary" onClick={openAdd}>+ Add Product</button>
        </div>
      </div>

      {error && <p style={{ color: "#c00", marginBottom: "12px" }}>{error}</p>}

      {/* Filters */}
      <div className="admin-filters">
        <input className="admin-search" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="admin-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="All">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Product Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="product-cell">
                    <img
                      src={getImageUrl(product.image_url) || "https://placehold.co/40x40/1a1a2e/fff?text=P"}
                      alt={product.name}
                      className="product-thumb"
                    />
                    <span>{product.name}</span>
                  </div>
                </td>
                <td><span className="category-tag">{product.categoryName}</span></td>
                <td>₹{Number(product.price).toLocaleString()}</td>
                <td>
                  <span className={`stock-badge ${product.stock < 10 ? "low-stock" : ""}`}>
                    {product.stock} {product.stock < 10 ? "⚠" : ""}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="admin-btn-edit" onClick={() => openEdit(product)}>Edit</button>
                    <button className="admin-btn-delete" onClick={() => setDeleteConfirm(product.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty-state">No products found.</div>}
      </div>

      {/* ════════════════════════════════════════════
          MANAGE CATEGORIES MODAL
          ════════════════════════════════════════════ */}
      {showCategoryModal && (
        <div className="admin-modal-overlay" onClick={() => { setShowCategoryModal(false); cancelEditCategory(); }}>
          <div className="admin-modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🗂 Manage Categories</h3>
              <button className="modal-close" onClick={() => { setShowCategoryModal(false); cancelEditCategory(); }}>✕</button>
            </div>

            <div className="admin-form" style={{ gap: 20 }}>

              {categoryError && (
                <div style={{ background: "#fde8eb", border: "1.5px solid #f5b8c0", color: "#b03048", borderRadius: 10, padding: "10px 14px", fontSize: 13, fontWeight: 700 }}>
                  ⚠ {categoryError}
                </div>
              )}

              {/* ── Existing categories list ── */}
              {categories.length > 0 && (
                <div>
                  <p style={{ fontSize: 12, fontWeight: 800, color: "var(--ocean)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                    Existing Categories ({categories.length})
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {categories.map((cat) => (
                      <div key={cat.id} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        background: editingCategory === cat.id ? "var(--ocean-dim)" : "var(--bg-elevated)",
                        border: editingCategory === cat.id ? "2px solid var(--ocean)" : "2px solid var(--border)",
                        borderRadius: 12, padding: "12px 16px", gap: 12,
                        transition: "all 0.18s"
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontWeight: 800, color: "var(--ocean)", fontSize: 14, fontFamily: "Nunito, sans-serif" }}>
                            {cat.name}
                          </p>
                          {cat.description && (
                            <p style={{ margin: "3px 0 0", fontSize: 12, color: "var(--text-muted)", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {cat.description}
                            </p>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                          {editingCategory === cat.id ? (
                            <button
                              className="admin-btn-secondary"
                              style={{ padding: "5px 12px", fontSize: 12 }}
                              onClick={cancelEditCategory}
                            >
                              Cancel
                            </button>
                          ) : (
                            <>
                              <button
                                className="admin-btn-edit"
                                style={{ padding: "5px 12px", fontSize: 12 }}
                                onClick={() => startEditCategory(cat)}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                className="admin-btn-delete"
                                style={{ padding: "5px 12px", fontSize: 12 }}
                                onClick={() => setDeleteCatConfirm(cat.id)}
                              >
                                🗑️
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Divider ── */}
              <div style={{ borderTop: "2px dashed var(--border)", margin: "4px 0" }} />

              {/* ── Add / Edit form ── */}
              <form onSubmit={handleSaveCategory} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <p style={{ fontSize: 12, fontWeight: 800, color: "var(--ocean)", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
                  {editingCategory ? `✏️ Editing: ${categories.find(c => c.id === editingCategory)?.name}` : "➕ Add New Category"}
                </p>
                <div className="admin-form-group">
                  <label>Category Name *</label>
                  <input
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="e.g. Building Sets"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Description</label>
                  <textarea
                    rows={2}
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    placeholder="Short description of this category..."
                  />
                </div>
                <div className="modal-actions" style={{ paddingTop: 0 }}>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => { setShowCategoryModal(false); cancelEditCategory(); }}
                  >
                    Close
                  </button>
                  <button type="submit" className="admin-btn-primary" disabled={categoryLoading}>
                    {categoryLoading ? "Saving..." : editingCategory ? "Save Changes" : "Add Category"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

      {/* ── Delete Category Confirm ── */}
      {deleteCatConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteCatConfirm(null)}>
          <div className="admin-modal confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-form">
              <div style={{ fontSize: 48, marginBottom: 8 }}>🗂️</div>
              <h3>Delete Category?</h3>
              <p>This will remove the category permanently.<br/>Products in this category may become uncategorized.</p>
              <div className="modal-actions">
                <button className="admin-btn-secondary" onClick={() => setDeleteCatConfirm(null)}>Cancel</button>
                <button className="admin-btn-delete" onClick={() => handleDeleteCategory(deleteCatConfirm)}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════
          ADD / EDIT PRODUCT MODAL
          ════════════════════════════════════════════ */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave} className="admin-form">
              <div className="form-row">
                <div className="admin-form-group">
                  <label>Product Name *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Classic Oxford Shirt" />
                </div>
                <div className="admin-form-group">
                  <label>Category *</label>
                  <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="admin-form-group">
                  <label>Price (₹) *</label>
                  <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="1499" />
                </div>
                <div className="admin-form-group">
                  <label>Stock Quantity *</label>
                  <input required type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="10" />
                </div>
              </div>

              {/* Main Image */}
              <div className="admin-form-group">
                <label>Product Image</label>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const preview = URL.createObjectURL(file);
                          setForm({ ...form, image: file, imagePreview: preview });
                        }
                      }}
                      style={{ display: "block", width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
                    />
                    <small style={{ color: "#666", marginTop: "4px", display: "block" }}>Supported: PNG, JPEG, GIF, WebP (Max 5MB)</small>
                  </div>
                  {form.imagePreview && (
                    <div style={{ width: "80px", height: "80px", borderRadius: "4px", overflow: "hidden", border: "1px solid #ddd", backgroundColor: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src={getImageUrl(form.imagePreview) || form.imagePreview} alt="Preview" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Images */}
              <div className="admin-form-group">
                <label>Additional Images <span style={{ color: "var(--text-muted)", fontWeight: 600, textTransform: "none", fontSize: "11px" }}>(up to 3 — shown in product gallery)</span></label>
                <div className="gallery-grid-4">
                  {gallery.map((slot, index) => (
                    <div key={index} className="gallery-slot-4">
                      {(slot.preview || slot.existing) ? (
                        <>
                          <img
                            src={slot.preview ? slot.preview : getImageUrl(slot.existing)}
                            alt={`Additional ${index + 1}`}
                            className="gallery-slot-img-4"
                            onError={(e) => { e.target.src = "https://placehold.co/80x80/DECCFE/255F83?text=🧸"; }}
                          />
                          <button type="button" className="gallery-remove-btn" onClick={() => removeGallerySlot(index)} title="Remove">✕</button>
                        </>
                      ) : (
                        <label className="gallery-slot-empty-4" htmlFor={`gallery-input-${index}`} title={`Add image ${index + 1}`}>
                          <span className="gallery-plus-icon">+</span>
                          <span className="gallery-slot-num">Image {index + 1}</span>
                        </label>
                      )}
                      <input id={`gallery-input-${index}`} ref={galleryRefs[index]} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleGalleryChange(index, e)} />
                    </div>
                  ))}
                </div>
                <small style={{ color: "#666", marginTop: "6px", display: "block" }}>Supported: PNG, JPEG, GIF, WebP (Max 5MB each)</small>
              </div>

              <div className="admin-form-group">
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Product description..." />
              </div>
              <div className="admin-form-group">
                <label>Short Description</label>
                <textarea rows={2} value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} placeholder="Short summary..." />
              </div>
              <div className="admin-form-group">
                <label className="checkbox-label">
                  <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
                  Featured Product
                </label>
              </div>
              <div className="admin-form-group">
                <label className="checkbox-label">
                  <input type="checkbox" checked={form.is_new} onChange={(e) => setForm({ ...form, is_new: e.target.checked })} />
                  New In Product
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="admin-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="admin-btn-primary" disabled={loading}>
                  {loading ? "Saving..." : editingProduct ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Product Confirm */}
      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-form">
              <div style={{ fontSize: 48, marginBottom: 8 }}>🗑️</div>
              <h3>Delete Product?</h3>
              <p>This action cannot be undone.</p>
              <div className="modal-actions">
                <button className="admin-btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="admin-btn-delete" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProducts;
