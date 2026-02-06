import React from 'react';
import { CartItem as CartItemType } from '../types';
import '../styles/Cart.css';

interface CartProps {
  items: CartItemType[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onUpdateQuantity, onRemove, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <p>Your cart is empty</p>
        <p className="cart-empty-hint">Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart-items">
        {items.map((item) => (
          <div key={item.product.id} className="cart-item">
            <img
              src={item.product.image_url}
              alt={item.product.name}
              className="cart-item-image"
            />
            
            <div className="cart-item-details">
              <h4>{item.product.name}</h4>
              <p className="cart-item-price">${item.product.price.toFixed(2)}</p>
            </div>
            
            <div className="cart-item-actions">
              <div className="quantity-controls">
                <button
                  onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="qty-btn"
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock}
                  className="qty-btn"
                >
                  +
                </button>
              </div>
              
              <button
                onClick={() => onRemove(item.product.id)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-footer">
        <div className="cart-total">
          <span>Total:</span>
          <span className="total-amount">${total.toFixed(2)}</span>
        </div>
        <button onClick={onCheckout} className="checkout-btn">
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
