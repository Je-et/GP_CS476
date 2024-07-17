import React, { useState } from 'react';
// import axios from 'axios'
import './Profile.css';
import Footer from './Footer';
import profileImage from './assets/Joker.jpg';
import itemImage from './assets/banana.jpg';

function Profile() {
  const [activeSection, setActiveSection] = useState('orders');
  const [orderProcessed, setOrderProcessed] = useState(false);
  // const [profileData, setProfileData] = useState(null);
  const handleButtonClick = (section) => {
    setActiveSection(section);
  };
  // useEffect(() => {
  //   // Fetch profile data from backend
  //   axios.get('http://localhost:5000/profile')
  //     .then(response => {
  //       setProfileData(response.data);
  //     })
  //     .catch(error => {
  //       console.error("There was an error fetching the profile data!", error);
  //     });
  // }, []);

  // if (!profileData) {
  //   return <div>Loading...</div>;
  // }

  // Function that handles the cancellation button - confirmation
  const cancelButton  = () => {
    if (!orderProcessed) {
      if (window.confirm("Confirm cancellation?")) {
        console.log("Order successfully cancelled.");
      }
    } else {
      console.log("Order has already been processed.");
    }
  };

  return (
    <div id="profile-body">
      <div id="profile-page">
        <div id="profile-page-container">
          <div id="profile-info-container">
            <div id="profile-info">
              <div id="pfp_photo">
                <img src={profileImage} alt="Profile" id="profile-image" />
              </div>
              <div id="pfp_text">
                <div id="pfp_text_name">JOKER</div>
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
              <>
                {[...Array(7)].map((_, index) => (
                  <div id="items" key={index}>
                    <div id="item-images">
                      <img src={itemImage} alt="Item" id="item-image" />
                    </div>
                    <div id="item-description">
                      <div id="item-description-text">
                        <p id="item-name">BANANA</p>
                        <p>Qty: 999</p>
                        <p>
                          Item description: Lorem ipsum dolor sit, amet consectetur adipisicing elit. Amet voluptatum ullam vero reprehenderit veritatis neque quisquam itaque.
                        </p>
                      </div>
                    </div>
                    <div id="item-buttons">
                      <div id="total-price">TOTAL: $99.99</div>
                      <div id="buy-again">
                        <button id="buy-again-button">BUY AGAIN</button>
                      </div>
                      <div id="cancel-order">
                        <button id="cancel-order-button" onClick={cancelButton}>CANCEL</button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {activeSection === 'history' && (
              <div id="items">
                {/* Placeholder for history content */}
                <div id="item-description">
                  <div id="item-description-text">
                    <p id="item-name">No history available.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Profile;