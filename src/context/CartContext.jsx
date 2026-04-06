import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCartAPI, addToCartAPI, removeFromCartAPI, updateCartQuantityAPI, clearCartAPI } from "../services/api";
import toast from "react-hot-toast";

const CartContext = createContext(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      const res = await getCartAPI();
      setCart(res.data);
    } catch {
      setCart([]);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product, quantity = 1) => {
    setLoading(true);
    try {
      const res = await addToCartAPI(product, quantity);
      setCart(res.data);
      toast.success(`${product.name} added to cart`, { icon: "🛒" });
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId, productName) => {
    setLoading(true);
    try {
      const res = await removeFromCartAPI(productId);
      setCart(res.data);
      toast.success(`${productName || "Item"} removed from cart`, { icon: "🗑️" });
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await updateCartQuantityAPI(productId, quantity);
      setCart(res.data);
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const clearCart = async () => {
    try {
      await clearCartAPI();
      setCart([]);
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, loading, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
