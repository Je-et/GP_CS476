import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import Footer from './Footer';
import profileImage from './assets/Joker.jpg'; // Default image, update this dynamically
import itemImage from './assets/banana.jpg'; // Default image, update this dynamically

function Profile() {
  const [activeSection, setActiveSection] = useState('orders');
  // const [orderProcessed, setOrderProcessed] = useState(false); Might use later on
  const [profileData, setProfileData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    fetchProfileData();
    fetchOrders();
    fetchOrderHistory();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get('/api/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setProfileData(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      const response = await axios.get('/api/orders/history', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setOrderHistory(response.data);
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
  };

  const handleButtonClick = (section) => {
    setActiveSection(section);
  };

  const cancelOrder = async (orderId) => {
    // Find the order in the current orders state
    const order = orders.find(order => order.order_id === orderId);

    // Check if the order is already processed
    if (order && order.status === 'processed') {
      console.error("Cannot cancel order: Order has already been processed.");
      return;
    }

    try {
      const response = await axios.post('/api/orders/cancel', { order_id: orderId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      console.log("Order canceled:", response.data);
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  const buyAgain = async (orderId) => {
    try {
      const response = await axios.post('/api/orders/buy_again', { order_id: orderId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      console.log("Order placed again:", response.data);
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error("Error placing order again:", error);
    }
  };

  return (
    <div id="profile-body">
      <div id="profile-page">
        <div id="profile-page-container">
          <div id="profile-info-container">
            <div id="profile-info">
              <div id="pfp_photo">
                <img src={profileData?.profile_picture || profileImage} alt="Profile" id="profile-image" />
              </div>
              <div id="pfp_text">
                <div id="pfp_text_name">{profileData?.username || 'JOKER'}</div>
                <div id="pfp_text_id">#1234567890</div>
              </div>
            </div>
            <div id="profile-buttons">
              <div id="profile-buttons-orders">
                <button
                  className={`profile-button ${activeSection === 'orders' ? 'active' : ''}`}
                  onClick={() => handleButtonClick('orders')}
                >
                  ORDERS
                </button>
              </div>
              <div id="profile-buttons-history">
                <button
                  className={`profile-button ${activeSection === 'history' ? 'active' : ''}`}
                  onClick={() => handleButtonClick('history')}
                >
                  HISTORY
                </button>
              </div>
            </div>
          </div>
          <div id="items-container">
            {activeSection === 'orders' && (
              orders.length > 0 ? (
                orders.map((order) => (
                  <div id="items" key={order.order_id}>
                    <div id="item-images">
                      <img src={itemImage} alt="Item" id="item-image" />
                    </div>
                    <div id="item-description">
                      <div id="item-description-text">
                        <p id="item-name">{order.item_name}</p>
                        <p>Qty: {order.quantity}</p>
                        <p>Total Price: ${order.total_price}</p>
                        <p>Status: {order.status}</p>
                      </div>
                    </div>
                    <div id="item-buttons">
                      <div id="total-price">TOTAL: ${order.total_price}</div>
                      <div id="buy-again">
                        <button id="buy-again-button" onClick={() => buyAgain(order.order_id)}>BUY AGAIN</button>
                      </div>
                      <div id="cancel-order">
                        <button id="cancel-order-button" onClick={() => cancelOrder(order.order_id)}>CANCEL</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div id="items">
                  <div id="item-description">
                    <div id="item-description-text">
                      <p id="item-name">No Orders Available.</p>
                    </div>
                  </div>
                </div>
              )
            )}
            {activeSection === 'history' && (
              orderHistory.length > 0 ? (
                orderHistory.map((order) => (
                  <div id="items" key={order.order_id}>
                    <div id="item-images">
                      <img src={itemImage} alt="Item" id="item-image" />
                    </div>
                    <div id="item-description">
                      <div id="item-description-text">
                        <p id="item-name">{order.item_name}</p>
                        <p>Qty: {order.quantity}</p>
                        <p>Total Price: ${order.total_price}</p>
                        <p>Status: {order.status}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div id="items">
                  <div id="item-description">
                    <div id="item-description-text">
                      <p id="item-name">No History Available.</p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Profile;