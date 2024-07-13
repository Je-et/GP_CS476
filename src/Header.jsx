import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">Logo</div>
      <input type="text" className="search" placeholder="Search for Products" />
      <div className="profile-cart">
        <div className="profile">
          <Link to='/profile'>Profile</Link>
        </div>
        <div className="cart">Cart</div>
      </div>
    </header>
  );
}

export default Header;
