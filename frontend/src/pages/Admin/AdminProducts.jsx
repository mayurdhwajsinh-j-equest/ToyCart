import { useState, useEffect } from "react";
import "./Admin.css";

const mockProducts = [
  { id: 1, name: "Classic Oxford Shirt", category: "Shirts", price: 1499, stock: 24, image: "https://placehold.co/60x60/1a1a2e/fff?text=S" },
  { id: 2, name: "Slim Fit Chinos", category: "Pants", price: 2199, stock: 15, image: "https://placehold.co/60x60/16213e/fff?text=P" },
  { id: 3, name: "Leather Derby Shoes", category: "Footwear", price: 3999, stock: 8, image: "https://placehold.co/60x60/0f3460/fff?text=F" },
  { id: 4, name: "Merino Wool Sweater", category: "Knitwear", price: 2799, stock: 12, image: "https://placehold.co/60x60/533483/fff?text=K" },
  { id: 5, name: "Formal Blazer", category: "Jackets", price: 5499, stock: 6, image: "https://placehold.co/60x60/e94560/fff?text=J" },
];

const emptyProduct = { name: "", category: "", price: "", stock: "", image: "", description: "" };

const categories = ["Shirts", "Pants", "Footwear", "Knitwear", "Jackets", "Accessories", "Denim"];

const AdminProducts = () => {
  const [products, setProducts] = useState(mockProducts);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "All" || p.category === filterCategory;
    return matchSearch && matchCat;
  });

  const openAdd = () => {
    setForm(emptyProduct);
    setEditingProduct(null);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setForm({ ...product });
    setEditingProduct(product.id);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct ? { ...form, id: editingProduct } : p))
      );
    } else {
      setProducts((prev) => [...prev, { ...form, id: Date.now(), price: Number(form.price), stock: Number(form.stock) }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Products</h2>
        <button className="admin-btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <input
          className="admin-search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="admin-select"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Product Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="product-cell">
                    <img src={product.image || "https://placehold.co/40x40/1a1a2e/fff?text=P"} alt={product.name} className="product-thumb" />
                    <span>{product.name}</span>
                  </div>
                </td>
                <td><span className="category-tag">{product.category}</span></td>
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

      {/* Add/Edit Modal */}
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
                  <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c}>{c}</option>)}
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
              <div className="admin-form-group">
                <label>Image URL</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
              </div>
              <div className="admin-form-group">
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Product description..." />
              </div>
              <div className="modal-actions">
                <button type="button" className="admin-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="admin-btn-primary">{editingProduct ? "Save Changes" : "Add Product"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Product?</h3>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="admin-btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="admin-btn-delete" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
