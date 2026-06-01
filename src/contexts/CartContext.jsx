import { createContext, useState } from "react";
import api from "../services/api";

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      // Gère les différentes structures de réponse
      const cartData = res.data.data || res.data;
      const items = (cartData?.items && Array.isArray(cartData.items)) ? cartData.items : [];
      setCartCount(items.length);
    } catch (err) {
      console.error("Erreur fetchCart:", err);
      setCartCount(0);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await api.post("/cart/add", { product_id: productId, quantity });
      await fetchCart();
    } catch (err) {
      console.error("Erreur addToCart:", err);
      throw err;
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await api.delete(`/cart/items/${cartItemId}`);
      await fetchCart();
    } catch (err) {
      console.error("Erreur removeFromCart:", err);
      throw err;
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      await api.put(`/cart/items/${cartItemId}`, { quantity });
      await fetchCart();
    } catch (err) {
      console.error("Erreur updateQuantity:", err);
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart/clear");
      await fetchCart();
    } catch (err) {
      console.error("Erreur clearCart:", err);
      throw err;
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, fetchCart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}