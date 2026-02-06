import React, { useEffect, useState } from 'react';
import { CartItem } from '../types';
import Cart from '../components/Cart';
import { cartStorage } from '../utils/cart';
import { api } from '../services/api';
import WebApp from '@twa-dev/sdk';
import '../styles/CartPage.css';

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    setCartItems(cartStorage.get());
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity > 0) {
      cartStorage.updateQuantity(productId, quantity);
      loadCart();
    }
  };

  const handleRemove = (productId: number) => {
    cartStorage.remove(productId);
    loadCart();
    
    if (WebApp.HapticFeedback) {
      WebApp.HapticFeedback.notificationOccurred('warning');
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    try {
      setLoading(true);
      
      const items = cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      await api.createOrder(items);
      
      // Clear cart
      cartStorage.clear();
      setCartItems([]);
      
      if (WebApp.HapticFeedback) {
        WebApp.HapticFeedback.notificationOccurred('success');
      }
      
      WebApp.showAlert('Order placed successfully!', () => {
        // Switch to orders tab
        window.dispatchEvent(new CustomEvent('switchTab', { detail: 'orders' }));
      });
    } catch (err) {
      console.error('Checkout error:', err);
      WebApp.showAlert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-page">
      <h2 className="page-title">Shopping Cart</h2>
      {loading ? (
        <div className="loading">Processing order...</div>
      ) : (
        <Cart
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemove={handleRemove}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  );
};

export default CartPage;
