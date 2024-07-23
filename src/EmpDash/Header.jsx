import React from 'react';
import './Header.css';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../assets/Logo.png';

function Header() {

  const navigate = useNavigate()

  const gotToNewPage = () => {
    navigate("/orderhistory");
  }

  return (
    <header className="header">
      <div className="logo">
        <Link to='/' >
          <img src={Logo} alt="Logo" className="header-logo" />
        </Link>
      </div>
      <div className="vertical_line"></div>

      <div className="title"> GreenBasket</div>
      <div className="vertical_line"></div>

      <div className="profile-cart">
   
        <button onClick={() => gotToNewPage()} className="order_history">Order-History</button>
        <div className="logout">Log Out</div>
      </div>
    </header>
  );
}

export default Header;