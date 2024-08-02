/* Imports React and hooks for managing state and fetching data. */
import React, { useState, useEffect } from 'react';

/* Imports Link for navigation and useNavigate for programmatic navigation. */
import { Link, useNavigate } from 'react-router-dom';

/* CSS styles for the Header */
import './Header.css';

/* Imports image assets for the cart icon, default profile picture, and logo. */
import Cart from './assets/Cart.png';
import defaultProfile from './assets/defaultProfile.png';
import Logo from './assets/Logo.png';

/* Imports a SearchBar component for searching items. */
import SearchBar from './SearchBar';


/* Functional component that receives cartItemCount and onItemSelect as props. */
function Header({ cartItemCount, onItemSelect }) {

  /* Controls drop down visibility */
  const [dropdownVisible, setDropdownVisible] = useState(false);

  /* Tracks user's login status */
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* Used for navigation. */
  const navigate = useNavigate();

  /* Checks if the user is logged in by looking for an access token in local storage. */
  useEffect(() => {
    const token = localStorage.getItem('access_token');

    /* Updates isLoggedIn state */
    setIsLoggedIn(!!token);
  }, []);

  /* Toggles the visibility of the dropdown menu. */
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  /* Logs out the user by removing the access token from local storage */
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);

    /* Navigates back to the Home Page */
    navigate('/');
  };

    /* Navigates to the Meal Planning page. */
  const handleMealPlanningClick = () => {
    navigate('/mealplanning');
  };

  return (
    /* Container for the header section. */
    <header className="header-header">

      {/* Contains the logo image linked to the homepage. */ }
      <div className="logo">

        {/* Navigates back to Home Page if the logo is clicked. */}
        <Link to='/'>
          <img src={Logo} alt="Logo" className="header-logo-image" />
        </Link>
      </div>

      {/* Includes the SearchBar component and a button for meal planning. */ }
      <div className="search-mealplanning-container">
        <SearchBar handleItemSelect={onItemSelect} />
        <button className="meal-planning-button" onClick={handleMealPlanningClick}>
          Meal Planning
        </button>
      </div>

      {/* Contains the profile and cart sections. */}
      <div className="profile-cart-container">
        <div className="profile-cart">

          {/* Displays the profile image and a dropdown menu. */}
          <div className="profile" onClick={toggleDropdown}>
            <img src={defaultProfile} alt="Default" className="profile-logo-image" />

            {/* Dropdown menu with links for profile, login, or logout */}
            <div id="myDropdown" className={`dropdown-content ${dropdownVisible ? 'show' : ''}`}>
              <Link to='/profile'>Profile</Link>
              {isLoggedIn ? (
                <a href="#!" onClick={handleLogout}>Logout</a>
              ) : (
                <Link to='/login'>Login</Link>
              )}
            </div>
          </div>

          {/* Displays the cart icon and item count if there are items in the cart. */}
          <div className="cart">
            <Link to='/cart'>
              <img src={Cart} alt="Cart" className="header-cart-image" />
              {cartItemCount > 0 && (
                <span className="cart-item-count">{cartItemCount}</span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

/* Making the Header component available for use in other parts of the website. */
export default Header;