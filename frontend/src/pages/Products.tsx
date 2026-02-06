import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { cartStorage } from '../utils/cart';
import WebApp from '@twa-dev/sdk';
import '../styles/Products.css';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    cartStorage.add({ product, quantity: 1 });
    
    // Show haptic feedback
    if (WebApp.HapticFeedback) {
      WebApp.HapticFeedback.notificationOccurred('success');
    }
    
    // Show notification
    WebApp.showAlert(`${product.name} added to cart!`);
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={loadProducts} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="products-page">
      <h2 className="page-title">Products</h2>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default Products;
