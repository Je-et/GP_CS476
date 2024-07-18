import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import Cart from './assets/Cart.png';
import defaultProfile from './assets/defaultProfile.png';
import Logo from './assets/Logo.png';

function Header() {
  const navigate = useNavigate();

  const handleMealPlanningClick = () => {
    navigate('/mealplanning');
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to='/' >
          <img src={Logo} alt="Logo" className="header-logo-image" />
        </Link>
      </div>
      <div className="search-mealplanning-container">
        <input type="text" className="search" placeholder="Search for Products ..." />
        <button className="meal-planning-button" onClick={handleMealPlanningClick}>
          Meal Planning
        </button>
      </div>
      <div className="profile-cart-container">
        <div className="profile-cart">
          <div className="profile">
            <Link to='/login' style={{ textDecoration: 'none' }}> Sign In</Link>
          </div>
          <div className="profile">
            <Link to='/profile'>
              <img src={defaultProfile} alt="Default" className="profile-logo-image" />
            </Link>
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