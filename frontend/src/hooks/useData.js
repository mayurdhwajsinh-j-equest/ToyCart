// Custom Hook for fetching products
// Usage: const { products, loading, error } = useProducts();

import { useState, useEffect } from 'react';
import APIService from '../services/api';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await APIService.getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};

// Custom Hook for fetching a single product by ID
export const useProductById = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await APIService.getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { product, loading, error };
};

// Custom Hook for fetching product details
export const useProductDetails = (id) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await APIService.getProductDetails(id);
        setDetails(data);
      } catch (err) {
        setError(err.message);
        console.error('Error loading product details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  return { details, loading, error };
};

// Custom Hook for fetching featured items
export const useFeaturedItems = (productId) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const data = await APIService.getFeaturedItems(productId);
        setItems(data);
      } catch (err) {
        setError(err.message);
        console.error('Error loading featured items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [productId]);

  return { items, loading, error };
};

// Custom Hook for fetching further details
export const useFurtherDetails = (productId) => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await APIService.getFurtherDetails(productId);
        setDetails(data);
      } catch (err) {
        setError(err.message);
        console.error('Error loading further details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [productId]);

  return { details, loading, error };
};

// Custom Hook for fetching toy box items
export const useToyBoxItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const data = await APIService.getToyBoxItems();
        setItems(data);
      } catch (err) {
        setError(err.message);
        console.error('Error loading toy box items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return { items, loading, error };
};
