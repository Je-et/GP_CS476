import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderHistory.css';
import OrderHistoryHeader from './OrderHistoryHeader';
import '../Cart.css';
import ItemPop from './ItemPop'; 

function OrderHistory() {

  // State to hold the orders fetched from the API
  const [orders, setOrders] = useState([]);

  // State to manage the loading state
  const [loading, setLoading] = useState(true);

   // State to manage the visibility of the item popup
  const [showItemPop, setShowItemPop] = useState(false);

   // State to hold the selected order items for viewing details
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);

  useEffect(() => {
    fetchOrderHistory();
  }, []);


  // Function to fetch order history from the API
  const fetchOrderHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No access token found');
        setLoading(false);
        return;
      }

      // Make an API request to fetch order history
      const response = await axios.get('/orders/employee/orders/history', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Check if the response contains data and set it to the orders state


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

   // Function to handle viewing details of an order
  const handleViewDetails = (orderItems) => {
    setSelectedOrderItems(orderItems);
    setShowItemPop(true); 
  };

  // Render a loading indicator if the data is still being fetched
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