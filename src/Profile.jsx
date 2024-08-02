/* Essential for creating React components. */
import React, { useState, useEffect } from 'react';

/* Used for sending HTTP Requests */
import axios from 'axios';

/* CSS styling for Profile component */
import './Profile.css';

/* Imports the default image for Profile page. */
import defaultProfileImage from './assets/defaultProfile.png';

function Profile() {
  /* Tracks which section of the profile (orders or history) is currently active. */
  const [activeSection, setActiveSection] = useState('orders');

  /* Stores user profile information. */
  const [profileData, setProfileData] = useState(null);

  /* Holds the current orders. */
  const [orders, setOrders] = useState([]);

  /* Contains the order history. */
  const [orderHistory, setOrderHistory] = useState([]);

  /* Indicates if the data is still being fetched. */
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  /* Asynchronously fetches profile data, current orders, and order history from the server. */
  const fetchData = async () => {
    setLoading(true);
    try {
      /* Sends a GET request */
      const profileResponse = await axios.get('/profile/', {
        headers: {
          /* Uses authorization headers with a token stored in localStorage. */
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setProfileData(profileResponse.data);
      /* Sends a GET request */
      const ordersResponse = await axios.get('/orders/', {
        headers: {
          /* Uses authorization headers with a token stored in localStorage. */
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setOrders(ordersResponse.data);
      /* Sends a GET request */
      const historyResponse = await axios.get('/orders/history', {
        headers: {
          /* Uses authorization headers with a token stored in localStorage. */
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setOrderHistory(historyResponse.data);
    } catch (error) {
      /* Displays an error message */
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  /* Updates the activeSection state to either "orders" or "history" based on which button is clicked. */
  const handleButtonClick = (section) => {
    setActiveSection(section);
  };

  /* Cancels an order if it has not been processed yet */
  const cancelOrder = async (orderId) => {

    /* Confirms the action with the user and sends a request to cancel the order. */
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
      /* Sends a POST request */
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

  /* Replaces an order by sending a request to the server. Updates the data after placing the order again. */
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

  /* Displays a loading when the data is being fetched. */
  if (loading) {
    return <div>Loading...</div>;
  }

  /* Constructs a URL for the profile picture or item images. */
  const getImageUrl = (picture) => {
    if (!picture) return 'https://via.placeholder.com/100';
    if (picture.startsWith('http')) return picture;
    if (picture.startsWith('/')) return `http://localhost:5000${picture}`;
    return `http://localhost:5000/items/image/${encodeURIComponent(picture)}`;
  };

  /* Sorts the order to show the recent orders first. */
  const sortedOrders = [...orders].sort((a, b) => parseInt(b.order_id) - parseInt(a.order_id));
  const sortedOrderHistory = [...orderHistory].sort((a, b) => parseInt(b.order_id) - parseInt(a.order_id));

  return (
    <div id="profile-body">
      <div id="profile-page">
        <div id="profile-page-container">
          <div id="profile-info-container">
            <div id="profile-info">
              {/* Uses a default profile image if the user's profile picture is not available or fails to load. */}
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
            {/* Provides buttons to switch between the orders and history sections. */}
            {/* Highlights the active section using the active class. */}
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
          {/* Conditionally renders the current orders section if it is active. */}
          {/* Displays a list of current orders with item details and buttons to reorder or cancel each order. */}
          <div id="items-container">
            {activeSection === 'orders' && (
              sortedOrders.length > 0 ? (
                sortedOrders.map((order, index) => (
                  <div id="items" key={order.order_id}>
                    <div id="item-description">
                      <div id="item-description-text">
                        <p className="profile-order-number">Order #{index + 1} - Order ID: {order.order_id}</p>
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="order-item">
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
                      <button id="buy-again-button" onClick={() => buyAgain(order.order_id)}>BUY AGAIN</button>
                      <button id="cancel-order-button" onClick={() => cancelOrder(order.order_id)}>CANCEL</button>
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
            {/* Conditionally renders the order history section if it is active. */}
            {/* Displays a list of past orders with similar details to the current orders but without action buttons. */}
            {activeSection === 'history' && (
              sortedOrderHistory.length > 0 ? (
                sortedOrderHistory.map((order, index) => (
                  <div id="items" key={order.order_id}>
                    <div id="item-description">
                      <div id="item-description-text">
                        <p className="profile-order-number">Order #{index + 1} - Order ID: {order.order_id}</p>
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="order-item">
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

/* Exports the Profile component so it can be used in other parts of the website. */
export default Profile;