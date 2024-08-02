import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Cart.css';
import Header from './Header';
import OrderInfo from './OrderInfo';
import defaultProfileImage from '../assets/defaultProfile.png'; 

function AppEmp() {
  // State to store profile data
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('/profile/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Display loading or error messages
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="App">
      <Header />
      <div className="cart-body">
        <div id="profile-info-emp">
          <div className='profile-image-container'>
          <img
            src={profileData?.profile_picture ? `/profile/profile_picture/${profileData.profile_picture}` : defaultProfileImage}
            alt={profileData?.profile_picture ? "Profile" : "Default"}
            id="profile-image-emp"
            onError={(e) => {
              console.error('Error loading image:', e.target.src);
              e.target.src = defaultProfileImage;
            }}
          />
          </div>
          <div id="pfp_text_name-emp">Employee: {profileData?.username || 'Emp'}</div>
        </div>
       
      

        <div className="cart-page">
          <div className="cart-container">
            <h1 className="cart-title">Your Dashboard</h1>
            <div className="cart-total"> </div>
            <div className="cart-item-container">
              <OrderInfo />
            </div>
            <div className="cart-actions">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppEmp;
