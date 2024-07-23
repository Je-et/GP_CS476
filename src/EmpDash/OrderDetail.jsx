import React from 'react';
import './OrderDetail.css';

function OrderDetail({ customerName, orderNumber, deliveryTime, status }) {
  return (

    
    <div className="order-detail">
      <div className="customer-name">Customer Name: {customerName}</div>
      <div className="order-number">Order Number: {orderNumber}</div>
      <div className="delivery-time">Delivery Time: {deliveryTime}</div>
      <div className="status">Status: {status}</div>
    </div>
  );
}

export default OrderDetail;
