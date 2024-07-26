import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import Cart from './assets/Cart.png';
import defaultProfile from './assets/defaultProfile.png';
import Logo from './assets/Logo.png';

function Header() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in by checking the presence of an access token
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    navigate('/'); // Redirect to homepage
  };

  return (
    <header className="header-header">
      <div className="logo">
        <Link to='/'>
          <img src={Logo} alt="Logo" className="header-logo-image" />
        </Link>
      </div>
      <div className="search-mealplanning-container">
        <input type="text" className="header-search" placeholder="Search for Products ..." />
      </div>
      <div className="profile-cart-container">
        <div className="profile-cart">
          <div className="profile" onClick={toggleDropdown}>
            <img src={defaultProfile} alt="Default" className="profile-logo-image" />
            <div id="myDropdown" className={`dropdown-content ${dropdownVisible ? 'show' : ''}`}>
              <Link to='/profile'>Profile</Link>
              {isLoggedIn ? (
                <a href="#!" onClick={handleLogout}>Logout</a>
              ) : (
                <Link to='/login'>Login</Link>
              )}
            </div>
          </div>
          <div className="cart">
            <Link to='/cart'>
              <img src={Cart} alt="Cart" className="header-cart-image" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;