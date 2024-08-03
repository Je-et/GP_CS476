import React from 'react';
import './ItemPop.css'; 

// ItemPop component receives three props: show, onClose, and orderItems
const ItemPop = ({ show, onClose, orderItems }) => {
  if (!show) {

    // If the 'show' prop is false, return null to render nothing
    return null; 
  }

  return (
    <div className="item-pop-overlay">
      <div className="item-pop-content">
        <h2>Order Details</h2>
        <ul className="item-list-pop">
          {orderItems.map((item, index) => (
            <li key={index} className="item-pop">
              <span className="item-name-pop">{item.item_name}</span> 
              <span className="item-quantity-pop"> Quantity: {item.quantity}</span>
            </li>
          ))}
        </ul>
        <button className="return-button" onClick={onClose}>Return</button>
      </div>
    </div>
  );
};

export default ItemPop;