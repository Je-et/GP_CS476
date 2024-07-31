import React from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.png';

function Header({ isEmployee }) {
  const navigate = useNavigate();

  const gotToNewPage = () => {
    navigate("/orderhistory");
  };

  const handleLogout = () => {
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