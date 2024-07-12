import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './Header.css';
import Profile from './Profile';

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
