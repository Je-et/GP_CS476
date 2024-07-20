import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import './app.css';
import Header from './Header';
import ItemList from './Itemlist';
import Profile from './Profile';
import Cart from './Cart';
import Checkout from './Checkout';
import Login from './Login';
import Signup from './Signup';
import MealPlanning from './MealPlanning'; // Correctly import MealPlanning

function App() {
  return (
    <Router>
      <div className="App">
        <ConditionalHeader />
        <MainContent />
      </div>
    </Router>
  );
}

function ConditionalHeader() {
  const location = useLocation();
  const showHeader = location.pathname !== '/login' && location.pathname !== '/signup';
  return showHeader ? <Header /> : null;
}

function MainContent() {
  const location = useLocation();
  const showContent = location.pathname !== '/profile' && location.pathname !== '/cart' && location.pathname !== '/checkout' && location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/mealplanning'; // Add MealPlanning route

  return (
    <>
      {showContent && (
        <div className="categories">
          <button>Produce</button>
          <button>Baby</button>
          <button>Home Essentials</button>
          <button>Meat</button>
          <button>Clothing</button>
          <button>Health</button>
          <button>Beauty</button>
          <button>Category</button>
        </div>
      )}
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mealplanning" element={<MealPlanning />} />
      </Routes>
      {showContent && <ItemList />}
    </>
  );
}

export default App;
