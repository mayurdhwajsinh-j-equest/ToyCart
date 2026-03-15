import { createContext, useState, useCallback, useEffect, useRef } from "react";
import APIService from "../services/api";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const isAddingRef = useRef(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("customerToken")
      : null;

  const syncCart = useCallback(async () => {
    if (!token) {
      setCartItems([]);
      return;
    }

    try {
      const data = await APIService.getCart(token);
      setCartItems(data?.items || []);
    } catch {
      setCartItems([]);
    }
  }, [token]);

  useEffect(() => {
    syncCart();
  }, [token]);

  const addToCart = useCallback(
    async (product) => {
      if (!token) return;
      if (isAddingRef.current) return;

      isAddingRef.current = true;
      try {
        await APIService.addToCart(
          { productId: product.id, quantity: 1 },
          token
        );
        const data = await APIService.getCart(token);
        setCartItems(data?.items || []);
      } catch (err) {
        console.error("addToCart failed:", err);
      } finally {
        isAddingRef.current = false;
      }
    },
    [token]
  );

  const removeFromCart = useCallback(
    async (cartItemId) => {
      if (!token) return;

      try {
        await APIService.removeCartItem(cartItemId, token);
        const data = await APIService.getCart(token);
        setCartItems(data?.items || []);
      } catch (err) {
        console.error("removeFromCart failed:", err);
      }
    },
    [token]
  );

  const updateQuantity = useCallback(
    async (cartItemId, quantity) => {
      if (!token) return;

      if (quantity <= 0) {
        await APIService.removeCartItem(cartItemId, token);
        const data = await APIService.getCart(token);
        setCartItems(data?.items || []);
        return;
      }

      try {
        await APIService.updateCartItem(cartItemId, quantity, token);
        const data = await APIService.getCart(token);
        setCartItems(data?.items || []);
      } catch (err) {
        console.error("updateQuantity failed:", err);
      }
    },
    [token]
  );

  const clearCart = useCallback(async () => {
    if (!token) return;

    try {
      await APIService.clearCart(token);
      setCartItems([]);
    } catch (err) {
      console.error("clearCart failed:", err);
    }
  }, [token]);

  const getCartCount = useCallback(() => {
    return cartItems.reduce((total, item) => {
      return total + (item.quantity || 1);
    }, 0);
  }, [cartItems]);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + price * (item.quantity || 1);
    }, 0);
  }, [cartItems]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getTotalPrice,
    syncCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}