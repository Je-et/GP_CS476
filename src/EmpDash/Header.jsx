import React from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.png';


// Header component definition
function Header({ isEmployee }) {

  // Hook to get the navigation function
  const navigate = useNavigate();


   // Function to navigate to the order history page
  const gotToNewPage = () => {
    navigate("/orderhistory");
  };

  const handleLogout = () => {

     // Removing access token and refresh tokenvfrom local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="logo">
          <img src={Logo} alt="Logo" className="header-logo" />
      </div>
      <div className="vertical_line"></div>

      <div className="title"> GreenBasket</div>
      <div className="vertical_line"></div>

      <div className="profile-cart">
       
        <button onClick={gotToNewPage} className="order_history">Order-History</button>
     
        <div className="logout" onClick={handleLogout}>Log Out</div>
      </div>
    </header>
  );
}

export default Header;