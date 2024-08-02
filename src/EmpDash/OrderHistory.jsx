import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderHistory.css';
import OrderHistoryHeader from './OrderHistoryHeader';
import '../Cart.css';
import ItemPop from './ItemPop'; 

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showItemPop, setShowItemPop] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No access token found');
        setLoading(false);
        return;
      }

      const response = await axios.get('/orders/employee/orders/history', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setOrders(response.data);
      } else {
        console.error('No orders data found in response.');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (orderItems) => {
    setSelectedOrderItems(orderItems);
    setShowItemPop(true); 
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <OrderHistoryHeader />
      <div className="cart-body">
        <div className="cart-page">
          <div className="cart-container">
            <h1 className="cart-title">Order History</h1>
            <div className="cart-total"> </div>
            <div className="cart-item-container">
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <div key={`order-${order.order_id}-${index}`} className="order-detail">
                    <div className="order-number">
                      Order Number: #{order.order_id}
                    </div>
                    <div className="status">Status: {order.status}</div>
                    <div className="total-price">Total Price: ${order.total_price.toFixed(2)}</div>
                    <div className="order-buttons">
                      <button
                        className="details-button"
                        onClick={() => handleViewDetails(order.items)}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-orders">
                  <p>No Cancelled or Processed Orders Available.</p>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
      <ItemPop
        show={showItemPop}
        onClose={() => setShowItemPop(false)}
        orderItems={selectedOrderItems}
      />
    </div>
  );
}

export default OrderHistory;