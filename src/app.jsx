import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './Header';
import ItemList from './Itemlist';
import Profile from './Profile';

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
  const showContent = location.pathname !== '/profile';

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
      </Routes>
      {showContent && <ItemList />}
    </>
  );
}

export default App;