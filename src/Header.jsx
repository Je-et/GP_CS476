import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import Cart from './assets/Cart.png';
import defaultProfile from './assets/defaultProfile.png';
import Logo from './assets/Logo.png';

function Header() {

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <header className="header-header">
      <div className="logo">
        <Link to='/' >
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
              <Link to='/login'>Login</Link>
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