import { createContext, useState } from "react";
import api from "../services/api";

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      const items = res.data.items || [];
      setCartCount(items.length);
    } catch {}
  };

  const addToCart = async (productId, quantity = 1) => {
    await api.post("/cart/add", { product_id: productId, quantity });
    await fetchCart();
  };

  return (
    <CartContext.Provider value={{ cartCount, fetchCart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}