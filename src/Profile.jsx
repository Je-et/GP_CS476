import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import Footer from './Footer';
import defaultProfileImage from './assets/defaultProfile.png'; // Default image

function Profile() {
  const [activeSection, setActiveSection] = useState('orders');
  const [profileData, setProfileData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const profileResponse = await axios.get('/profile/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setProfileData(profileResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (section) => {
    setActiveSection(section);
  };

  const cancelOrder = async (orderId) => {
    const order = orders.find(order => order.order_id === orderId);

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
      fetchData(); // Refresh data
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
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error placing order again:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading indicator
  }

  return (
    <div id="profile-body">
      <div id="profile-page">
        <div id="profile-page-container">
          <div id="profile-info-container">
            <div id="profile-info">
              <div id="pfp_photo">
                <img
                  src={profileData?.profile_picture ? `/profile/profile_picture/${profileData.profile_picture}` : defaultProfileImage}
                  alt={profileData?.profile_picture ? "Profile" : "Default"}
                  id="profile-image"
                  onError={(e) => {
                    console.error('Error loading image:', e.target.src);
                    e.target.src = defaultProfileImage;
                  }}
                />
              </div>
              <div id="pfp_text">
                <div id="pfp_text_name">{profileData?.username || 'GUEST'}</div>
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
                      <img src={defaultProfileImage} alt="Item" id="item-image" />
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
                      <img src={defaultProfileImage} alt="Item" id="item-image" />
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
      </div>
    </div>
  );
}

export default Profile;