import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderInfo.css';
import ItemPop from './ItemPop'; 

function OrderInfo() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showItemPop, setShowItemPop] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No access token found');
        setLoading(false);
        return;
      }

      const response = await axios.get('/orders/employee/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        const pendingOrders = response.data.filter(order => order.status === 'Pending');
        setOrders(pendingOrders);
      } else {
        console.error('No orders data found in response.');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No access token found');
        return;
      }

      const response = await axios.post(`/orders/employee/orders/accept`, 
        { order_id: orderId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Order picked:", response.data);
      fetchOrders();
    } catch (error) {
      console.error("Error picking order:", error);
    }
  };

  
  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No access token found');
        return;
      }

      const response = await axios.post('/orders/employee/orders/cancel', 
        { order_id: orderId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Order canceled:", response.data);
      fetchOrders(); 
    } catch (error) {
      console.error("Error canceling order:", error);
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
    <div className="order-info-container">
      <div className="order-list">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={`order-${order.id}-${index}`} className="order-detail">
              <div className="order-number">
                Order Number: #{order.order_id}
              </div>
              <div className="status">Status: {order.status}</div>
              <div className="total-price">Total Price: ${order.total_price.toFixed(2)}</div>
              {order.status === 'Pending' && (
                <div className="order-buttons">
                  <button
                    className="accept-order-button"
                    onClick={() => handleAcceptOrder(order.order_id)}
                  >
                    Accept Order
                  </button>
                  <button
                    className="cancel-order-button"
                    onClick={() => handleCancelOrder(order.order_id)}
                  >
                    Cancel Order
                  </button>
                  <button
                    className="details-button"
                    onClick={() => handleViewDetails(order.items)}
                  >
                    Details
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-orders">
            <p>No Orders Available.</p>
          </div>
        )}
      </div>
      <ItemPop
        show={showItemPop}
        onClose={() => setShowItemPop(false)}
        orderItems={selectedOrderItems}
      />
    </div>
  );
}

export default OrderInfo;