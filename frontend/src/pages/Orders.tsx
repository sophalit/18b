import React, { useEffect, useState } from 'react';
import { Order } from '../types';
import { api } from '../services/api';
import OrderList from '../components/OrderList';
import '../styles/Orders.css';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
    
    // Listen for order updates
    const handleOrderUpdate = () => {
      loadOrders();
    };
    
    window.addEventListener('orderUpdated', handleOrderUpdate);
    return () => window.removeEventListener('orderUpdated', handleOrderUpdate);
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={loadOrders} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h2 className="page-title">My Orders</h2>
      <OrderList orders={orders} />
    </div>
  );
};

export default Orders;
