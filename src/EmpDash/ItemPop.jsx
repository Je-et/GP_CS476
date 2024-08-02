import React from 'react';
import './ItemPop.css'; 

const ItemPop = ({ show, onClose, orderItems }) => {
  if (!show) {
    return null; 
  }

  return (
    <div className="item-pop-overlay">
      <div className="item-pop-content">
        <h2>Order Details</h2>
        <ul className="item-list">
          {orderItems.map((item, index) => (
            <li key={index} className="item">
              <span className="item-name">{item.item_name}</span> 
              <span className="item-quantity"> Quantity: {item.quantity}</span>
            </li>
          ))}
        </ul>
        <button className="return-button" onClick={onClose}>Return</button>
      </div>
    </div>
  );
};

export default ItemPop;