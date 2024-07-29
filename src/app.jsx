// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './app.css';
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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const response = await axios.get('http://localhost:5000/cart/items', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const count = response.data.reduce((total, item) => total + item.quantity, 0);
        setCartCount(count);
      }
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
    }
  };

  const updateCartCount = (change) => {
    setCartCount(prevCount => prevCount + change);
    fetchCartCount();
  };

  const handleItemSelect = (itemId) => {
    setSelectedItemId(itemId);
  };

  return (
    <Router>
      <div className="App">
        <ConditionalHeader cartCount={cartCount} onItemSelect={handleItemSelect} />
        <MainContent 
          updateCartCount={updateCartCount} 
          handleItemSelect={handleItemSelect}
        />
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

function ConditionalHeader({cartCount, onItemSelect}) {
  const location = useLocation();
  const showHeader = location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== "/empdashboard" && location.pathname !== "/orderhistory";
  return showHeader ? <Header cartItemCount={cartCount} onItemSelect={onItemSelect} /> : null;
}

function MainContent({updateCartCount, handleItemSelect}) {
  const location = useLocation();
  const navigate = useNavigate();
  const showContent = location.pathname !== '/profile' && location.pathname !== '/cart' && location.pathname !== '/checkout' && location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/mealplanning' && location.pathname !== "/empdashboard" && location.pathname !== "/orderhistory";

  const gotToNewPage = () => {
    navigate("/empdashboard");
  }

  return (
    <>
      {showContent && (
        <div className="categories">
          <button onClick={() => gotToNewPage()}>Employee Dashboard </button>
        </div>
      )}
      <Routes>
        <Route path="/" element={<ItemList updateCartCount={updateCartCount} handleItemSelect={handleItemSelect} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart updateCartCount={updateCartCount} />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mealplanning" element={<MealPlanning updateCartCount={updateCartCount} />} />
        <Route path="/empdashboard" element={<AppEmp />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
      </Routes>
    </>
  );
}

export default App;