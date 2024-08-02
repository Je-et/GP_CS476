/* Import statements represents the necessary modules, components and all the styles needed in order for this page to properly work and reflect on our website. */

/* React is the main library to be used for building the user interfaces. */
/* useState is used to add or manage React state to a function component. */
/* useEffect is used for data fetching. */
import React, { useState, useEffect } from 'react';

/* BrowserRouter as Router provides the router context for our website. It enables navigation and URL handling. */
/* Routes and Route defines the routing structure thats maps out paths to various components */
/* useLocation is a hook that returns the current location of an object. */
/* useNavigate provides a function that is use for navigation in this page. */
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

/* This imports the custom CSS file made to be used for styling this page. */
import './app.css';

/* These imports are various components which will be used within this App.jsx */
import Header from './Header';
import ItemList from './Itemlist';
import Profile from './Profile';
import Cart from './Cart';
import Checkout from './Checkout';
import Login from './Login';
import Signup from './Signup';
import MealPlanning from './MealPlanning';
import AppEmp from './EmpDash/AppEmp.jsx';
import OrderHistory from "./EmpDash/OrderHistory"
import ItemDetail from './ItemDetail';

/* ToastContainer is a component that is used to display various toast notifications. */
import { ToastContainer } from 'react-toastify';

/* This is the CSS file used to provide stylings for the toast notifications. */
import 'react-toastify/dist/ReactToastify.css';

/* Axios is used for making API requests to the backend. */
import axios from 'axios';

/* This is where the Main body of the App.jsx component starts. */
function App() {

  /* useState is used for managing various states */

  /* cartCount stores the number of items within the cart */
  /* setCartCount is the function that updates the cartCount */
  const [cartCount, setCartCount] = useState(0);

  /* selectedItemId stores the ID of the currently selected item. */
  /* setSelectedItemId is the function that updates the selectedItemId. */
  const [selectedItemId, setSelectedItemId] = useState(null);

  /* isEmployee stores the user's role status in the website. They can be either a Shopper or an Employee. */
  /* setIsEmployee is the function to update the isEmployee. */
  const [isEmployee, setIsEmployee] = useState(false);

  /* useEffect executes fetchCartCount when the component is rendered. */
  useEffect(() => {

    /* fectCartCount fetches the cart's count from the server. */
    fetchCartCount();
  }, []);


  const fetchCartCount = async () => {
    try {
      
      /* This retrieves the access token from the localStorage */
      const token = localStorage.getItem('access_token');
      if (token) {

        /* Makes a GET request to fetch the cart items. */
        const response = await axios.get('http://localhost:5000/cart/items', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        /* This updates the cartCount based on the response. */
        const count = response.data.reduce((total, item) => total + item.quantity, 0);
        setCartCount(count);
      }
    } catch (error) {

      /* Displays error message. */
      console.error('Failed to fetch cart count:', error);
    }
  };


  /* This updates the cart count state and fetches the latest count. */
  const updateCartCount = (change) => {

    /* Adjusts the cartCount by a specified change. */
    setCartCount(prevCount => prevCount + change);

    /* This ensures that the count is up-to-date. */
    fetchCartCount();
  };


  /* This selects the selected item ID for displaying its detaisl. */
  const handleItemSelect = (itemId) => {

    /* Updates setSelectedItemId to the given item ID. */
    setSelectedItemId(itemId);
  };

  return (

    /* Router is used for routing and renders ConditionalHeader, MainContent, ItemDetail (conditionally), and ToastContainer. */

    <Router>
      <div className="App">
        <ConditionalHeader cartCount={cartCount} onItemSelect={handleItemSelect} isEmployee={isEmployee} />
        <MainContent 
          updateCartCount={updateCartCount} 
          handleItemSelect={handleItemSelect}

          /* Pass the value of isEmployee to the MainContent. */
          isEmployee={isEmployee}

          /* Pass the setIsEmployee function. */
          setIsEmployee={setIsEmployee} />

        {selectedItemId && (
          <ItemDetail 
            itemId={selectedItemId} 
            updateCartCount={updateCartCount}
            onClose={() => setSelectedItemId(null)}
          />
        )}
        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </Router>
  );
}

/* This conditionally renders the Header component. */

function ConditionalHeader({cartCount, onItemSelect, isEmployee}) {

  /* useLocation is used to get the current route. */
  /* location is an object that represents the current URL. */
  const location = useLocation();

  /* showHeader is a boolean value that determines if the Header should be shown. */
  /* Renders the Header if the value is true, */
  const showHeader = location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== "/empdashboard" && location.pathname !== "/orderhistory";
  return showHeader ? <Header cartItemCount={cartCount} onItemSelect={onItemSelect} isEmployee={isEmployee} /> : null;
}

/* This manages the main content area. */

function MainContent({updateCartCount, handleItemSelect, isEmployee, setIsEmployee}) {

  /* useLocation is used to get the current route. */
  const location = useLocation();

  /* useNavigate for navigations */
  const navigate = useNavigate();

  /* showContent is a boolean value to determine if the main content should be shown. */
  const showContent = location.pathname !== '/profile' && location.pathname !== '/cart' && location.pathname !== '/checkout' && location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/mealplanning' && location.pathname !== "/empdashboard" && location.pathname !== "/orderhistory";

  /* This redirects the page to the Employee Dashboard route. */
  const goToEmployeeDashboard = () => {
    navigate("/empdashboard");
  }

  return (
    /* Conditionally renders a button to go to the Employee Dashboard if the user is an employee. */
    <>
      {showContent && isEmployee && (
        <button className="employee-dashboard-btn" onClick={goToEmployeeDashboard}>
          <span className="btn-icon">👤</span>
          <span className="btn-text">Employee Dashboard</span>
        </button>
      )}

      {/* This sets the Routes to map the paths for different components */}
      <Routes>
        <Route path="/" element={<ItemList updateCartCount={updateCartCount} handleItemSelect={handleItemSelect} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart updateCartCount={updateCartCount} />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Pass the setIsEmployee function */}
        <Route path="/login" element={<Login setIsEmployee={setIsEmployee} />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/mealplanning" element={<MealPlanning updateCartCount={updateCartCount} handleItemSelect={handleItemSelect}/>} />
        <Route path="/empdashboard" element={<AppEmp />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
      </Routes>
    </>
  );
}

/* Makes the App component available for use in other parts of the website. */
export default App;
