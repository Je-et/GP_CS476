import React from 'react';
import './OrderHistory.css';
import OrderHistoryHeader from './OrderHistoryHeader';
import OrderInfo from './OrderInfo';
import { useNavigate } from 'react-router-dom';

function OrderHistory() {

  

  return (
    <div className="App">

      <OrderHistoryHeader />
      <hr></hr>
      <input type="text" className="search" placeholder="Search" />
      <div className="title1">Order detail:</div>
      <OrderInfo />
      <button className="button">Complete Order Review</button>
    </div>



  );
}

export default  OrderHistory;