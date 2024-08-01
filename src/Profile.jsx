import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import defaultProfileImage from './assets/defaultProfile.png';

function Profile() {
  const [activeSection, setActiveSection] = useState('orders');
  const [profileData, setProfileData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
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

      const ordersResponse = await axios.get('/orders/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setOrders(ordersResponse.data);

      const historyResponse = await axios.get('/orders/history', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setOrderHistory(historyResponse.data);
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
    const isConfirmed = window.confirm('Are you sure you want to cancel this order?');

    if (!isConfirmed) {
      return;
    }

    const order = orders.find(order => order.order_id === orderId);

    if (order && order.status === 'processed') {
      console.error("Cannot cancel order: Order has already been processed.");
      return;
    }

    try {
      const response = await axios.post('/orders/cancel', { order_id: orderId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      console.log("Order canceled:", response.data);
      fetchData();
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  const buyAgain = async (orderId) => {
    try {
      const response = await axios.post('/orders/buy_again', { order_id: orderId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      console.log("Order placed again:", response.data);
      fetchData();
    } catch (error) {
      console.error("Error placing order again:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const getImageUrl = (picture) => {
    if (!picture) return 'https://via.placeholder.com/100';
    if (picture.startsWith('http')) return picture;
    if (picture.startsWith('/')) return `http://localhost:5000${picture}`;
    return `http://localhost:5000/items/image/${encodeURIComponent(picture)}`;
  };

  return (
    <div id="profile-body">
      <div id="profile-page">
        <div id="profile-page-container">
          <div id="profile-info-container">
            <div id="profile-info">
              <img
                src={profileData?.profile_picture ? `/profile/profile_picture/${profileData.profile_picture}` : defaultProfileImage}
                alt={profileData?.profile_picture ? "Profile" : "Default"}
                id="profile-image"
                onError={(e) => {
                  console.error('Error loading image:', e.target.src);
                  e.target.src = defaultProfileImage;
                }}
              />
              <div id="pfp_text_name">{profileData?.username || 'GUEST'}</div>
            </div>
            <div id="profile-buttons">
              <button
                className={`profile-button ${activeSection === 'orders' ? 'active' : ''}`}
                onClick={() => handleButtonClick('orders')}
              >
                ORDERS
              </button>
              <button
                className={`profile-button ${activeSection === 'history' ? 'active' : ''}`}
                onClick={() => handleButtonClick('history')}
              >
                HISTORY
              </button>
            </div>
          </div>
          <div id="items-container">
            {activeSection === 'orders' && (
              orders.length > 0 ? (
                orders.map((order) => (
                  <div id="items" key={order.order_id}>
                    <div id="item-description">
                      <div id="item-description-text">
                        {order.items.map((item, index) => (
                          <div key={index} className="order-item">
                            <img
                              src={getImageUrl(item.picture)}
                              alt={item.item_name}
                              className="order-item-image"
                            />
                            <div className="order-item-details">
                              <p id="item-name">{item.item_name}</p>
                              <p>Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                        <p>Status: {order.status}</p>
                      </div>
                    </div>
                    <div id="item-buttons">
                      <div id="total-price">TOTAL: ${order.total_price.toFixed(2)}</div>
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
                      <img src={getImageUrl(order.items[0]?.item_picture)} alt="Item" id="item-image" />
                    </div>
                    <div id="item-description">
                      <div id="item-description-text">
                        {order.items.map((item, index) => (
                          <div key={index}>
                            <p id="item-name">{item.item_name}</p>
                            <p>Qty: {item.quantity}</p>
                          </div>
                        ))}
                        <p>Total Price: ${order.total_price.toFixed(2)}</p>
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