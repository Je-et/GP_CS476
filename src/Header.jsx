import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to='/' style={{ textDecoration: 'none' }}>Logo</Link>
      </div>
      <input type="text" className="search" placeholder="Search for Products" />
      <div className="profile-cart">
        <div className="profile">
          <Link to='/profile' style={{ textDecoration: 'none' }}>Profile</Link>
        </div>
        <div className="cart">
          <Link to='/cart' style={{ textDecoration: 'none' }}>Cart</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
