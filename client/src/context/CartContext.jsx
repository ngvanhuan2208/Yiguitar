/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/axios';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user, setIsAuthOpen } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState(null);
  const isInitialMount = useRef(true);

  // 1. Handle loading cart when user changes (Sync from DB)
  useEffect(() => {
    const fetchDBCart = async () => {
      if (user) {
        try {
          const res = await api.get('/cart');
          if (res.data && res.data.items) {
            const dbItems = res.data.items.map(item => ({
              ...item.productId,
              quantity: item.quantity
            })).filter(item => item && item._id); // Filter out potential nulls
            setCartItems(dbItems);
          }
        } catch (err) {
          console.error('Error fetching DB cart:', err);
          // Fallback to local
          const savedCart = localStorage.getItem(`yi-guitar-cart-${user._id}`);
          if (savedCart) setCartItems(JSON.parse(savedCart));
        }
      } else {
        setCartItems([]);
      }
      isInitialMount.current = false;
    };
    fetchDBCart();
  }, [user]);

  // 2. Handle saving cart when items change (Sync to DB)
  useEffect(() => {
    const syncCart = async () => {
      if (user && !isInitialMount.current) {
        // Save to localStorage
        localStorage.setItem(`yi-guitar-cart-${user._id}`, JSON.stringify(cartItems));
        
        // Sync to Server
        try {
          await api.post('/cart/sync', {
            items: cartItems.map(item => ({
              productId: item._id,
              quantity: item.quantity
            }))
          });
        } catch (err) {
          console.error('Error syncing cart to server:', err);
        }
      }
    };

    // L10: Debounce Cart Sync
    const timeoutId = setTimeout(() => {
      syncCart();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [cartItems, user]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = (product, quantity = 1) => {
    if (!user) {
      showNotification("Cậu cần đăng nhập để thêm sản phẩm vào giỏ nhé! 😊");
      setIsAuthOpen(true);
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);
      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + (quantity || 1) } : item
        );
      }
      return [...prevItems, { ...product, quantity: quantity || 1 }];
    });
    showNotification(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, amount) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item._id === productId) {
          const newQty = Math.max(1, item.quantity + amount);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    if (user) {
      localStorage.removeItem(`yi-guitar-cart-${user._id}`);
    }
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        notification
      }}
    >
      {children}
      {/* Toast Notification UI */}
      {notification && (
        <div className="fixed bottom-10 right-10 z-[100] bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-bounce-in border border-white/10">
           <div className="w-8 h-8 bg-[#00c7d3] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
           </div>
           <span className="font-bold text-sm tracking-wide">{notification}</span>
        </div>
      )}
    </CartContext.Provider>
  );
};
