// API Service - Centralized data fetching
// This is the ONLY place you'll need to update when connecting your backend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// For now, we're using static data imported from a file
// When backend is ready, just replace these fetch calls with actual API endpoints

class APIService {
  // PRODUCTS
  static async getProducts() {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch(`${API_BASE_URL}/products`);
      // return await response.json();
      
      // For now, import and return static data
      const products = await import('../data/productsData.js');
      return products.default;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  static async getProductById(id) {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch(`${API_BASE_URL}/products/${id}`);
      // return await response.json();
      
      const products = await this.getProducts();
      return products.find(p => p.id === parseInt(id));
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // PRODUCT DETAILS (for PDP page)
  static async getProductDetails(id) {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch(`${API_BASE_URL}/products/${id}/details`);
      // return await response.json();
      
      const details = await import('../data/productDetailsData.js');
      return details.default[id] || null;
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw error;
    }
  }

  // FEATURED ITEMS
  static async getFeaturedItems(productId) {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch(`${API_BASE_URL}/featured-items?productId=${productId}`);
      // return await response.json();
      
      const featured = await import('../data/featuredItemsData.js');
      return featured.default;
    } catch (error) {
      console.error('Error fetching featured items:', error);
      throw error;
    }
  }

  // FURTHER DETAILS
  static async getFurtherDetails(productId) {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch(`${API_BASE_URL}/further-details?productId=${productId}`);
      // return await response.json();
      
      const details = await import('../data/furtherDetailsData.js');
      return details.default;
    } catch (error) {
      console.error('Error fetching further details:', error);
      throw error;
    }
  }

  // TOY BOX ITEMS
  static async getToyBoxItems() {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch(`${API_BASE_URL}/toybox-items`);
      // return await response.json();
      
      const items = await import('../data/toyBoxData.js');
      return items.default;
    } catch (error) {
      console.error('Error fetching toy box items:', error);
      throw error;
    }
  }
}

export default APIService;
