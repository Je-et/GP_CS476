import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './Header';
import ItemList from './Itemlist';
import Profile from './Profile';
import Cart from './Cart';
import Checkout from './Checkout';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <MainContent />
      </div>
    </Router>
  );
}

function MainContent() {
  const location = useLocation();
  const showContent = location.pathname !== '/profile' && location.pathname !== '/cart' && location.pathname !== '/checkout';


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
          <button>Checkout</button>
          <button>Cart</button>
        </div>
      )}
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

      </Routes>
      {showContent && <ItemList />}
    </>
  );
}

export default App