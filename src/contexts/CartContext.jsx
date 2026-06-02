import { createContext, useState } from "react";
import api from "../services/api";

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      const items = res.data.items || [];
      setCartCount(items.reduce((acc, item) => acc + item.quantity, 0));
    } catch {
      setCartCount(0);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    await api.post("/cart/add", { product_id: productId, quantity });
    await fetchCart();
  };

  const removeFromCart = async (cartItemId) => {
    await api.delete(`/cart/items/${cartItemId}`);
    await fetchCart();
  };

  const updateQuantity = async (cartItemId, quantity) => {
    await api.put(`/cart/items/${cartItemId}`, { quantity });
    await fetchCart();
  };

  const clearCart = async () => {
    await api.delete("/cart/clear");
    setCartCount(0);
  };

  return (
    <CartContext.Provider value={{ cartCount, fetchCart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}