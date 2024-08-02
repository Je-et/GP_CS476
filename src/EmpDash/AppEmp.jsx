import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Cart.css';
import Header from './Header';
import OrderInfo from './OrderInfo';

function AppEmp() {
  return (
    <div className="App">
      <Header />
      <div className="cart-body">
        <div className="cart-page">
          <div className="cart-container">
            <h1 className="cart-title">Your Dashboard</h1>
            <div className="cart-total"> </div>
            <div className="cart-item-container">
              <OrderInfo />
            </div>
            <div className="cart-actions">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AppEmp;