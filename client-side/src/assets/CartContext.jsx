import React, { createContext, useContext, useState,useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);


  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);


  const handleUpdateQuantity = (product, change) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item._id === product._id && item.category === product.category
      );
  
      if (existingItem) {
        const newQuantity = existingItem.quantity + change;
        if (newQuantity <= 0) {
          return prevCart.filter(
            (item) =>
              item._id !== product._id || item.category !== product.category
          );
        } else {
          return prevCart.map((item) =>
            item._id === product._id && item.category === product.category
              ? { ...item, quantity: newQuantity }
              : item
          );
        }
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };
  

  const removeFromCart = (product) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => item.id !== product.id || item.category !== product.category
      )
    );
  };

  
 const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };



  return (
    <CartContext.Provider value={{ cart, handleUpdateQuantity, removeFromCart,clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
