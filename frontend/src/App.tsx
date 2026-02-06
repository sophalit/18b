import React, { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import Products from './pages/Products';
import CartPage from './pages/CartPage';
import Orders from './pages/Orders';
import { cartStorage } from './utils/cart';
import './styles/App.css';

type Tab = 'products' | 'cart' | 'orders';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Initialize Telegram WebApp
    WebApp.ready();
    WebApp.expand();
    
    // Apply Telegram theme
    document.documentElement.style.setProperty(
      '--tg-theme-bg-color',
      WebApp.backgroundColor || '#ffffff'
    );
    document.documentElement.style.setProperty(
      '--tg-theme-text-color',
      WebApp.textColor || '#000000'
    );
    document.documentElement.style.setProperty(
      '--tg-theme-button-color',
      WebApp.buttonColor || '#3390ec'
    );
    document.documentElement.style.setProperty(
      '--tg-theme-button-text-color',
      WebApp.buttonTextColor || '#ffffff'
    );

    // Update cart count
    updateCartCount();

    // Listen for tab switch events
    const handleSwitchTab = (event: CustomEvent) => {
      setActiveTab(event.detail);
    };

    window.addEventListener('switchTab', handleSwitchTab as EventListener);
    return () => window.removeEventListener('switchTab', handleSwitchTab as EventListener);
  }, []);

  const updateCartCount = () => {
    setCartCount(cartStorage.getItemCount());
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    updateCartCount();
    
    if (WebApp.HapticFeedback) {
      WebApp.HapticFeedback.impactOccurred('light');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🛍️ Shop</h1>
      </header>

      <main className="app-content">
        {activeTab === 'products' && <Products />}
        {activeTab === 'cart' && <CartPage />}
        {activeTab === 'orders' && <Orders />}
      </main>

      <nav className="app-nav">
        <button
          className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => handleTabChange('products')}
        >
          <span className="nav-icon">🏪</span>
          <span className="nav-label">Products</span>
        </button>
        
        <button
          className={`nav-btn ${activeTab === 'cart' ? 'active' : ''}`}
          onClick={() => handleTabChange('cart')}
        >
          <span className="nav-icon">
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </span>
          <span className="nav-label">Cart</span>
        </button>
        
        <button
          className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => handleTabChange('orders')}
        >
          <span className="nav-icon">📦</span>
          <span className="nav-label">Orders</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
