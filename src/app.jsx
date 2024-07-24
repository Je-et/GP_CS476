import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link, useNavigate } from 'react-router-dom';
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
  const showHeader = location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== "/empdashboard" && location.pathname !== "/orderhistory";
  return showHeader ? <Header /> : null;
}

function MainContent() {
  const location = useLocation();
  const showContent = location.pathname !== '/profile' && location.pathname !== '/cart' && location.pathname !== '/checkout' && location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/mealplanning' && location.pathname !== "/empdashboard" && location.pathname !== "/orderhistory"; // Add MealPlanning route

  const navigate = useNavigate()

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
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mealplanning" element={<MealPlanning />} />
        <Route path="/empdashboard" element={<AppEmp />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
      </Routes>
      {showContent && <ItemList />}
    </>
  );
}

export default App;
