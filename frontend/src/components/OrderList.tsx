import React from 'react';
import { Order } from '../types';
import '../styles/OrderList.css';

interface OrderListProps {
  orders: Order[];
}

const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <p>No orders yet</p>
        <p className="orders-empty-hint">Your orders will appear here</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'processing':
        return 'status-processing';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  return (
    <div className="orders-list">
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <span className="order-id">Order #{order.id}</span>
            <span className={`order-status ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          
          <div className="order-details">
            <div className="order-info">
              <span className="order-date">
                {new Date(order.created_at).toLocaleDateString()}
              </span>
              <span className="order-total">
                ${order.total_amount.toFixed(2)}
              </span>
            </div>
            
            {order.items && order.items.length > 0 && (
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <span>{item.product_name || `Product #${item.product_id}`}</span>
                    <span>x{item.quantity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
