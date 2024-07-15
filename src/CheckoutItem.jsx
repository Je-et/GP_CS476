import React from 'react';

const CheckoutItem = ({ item, quantity, increaseQuantity, decreaseQuantity, removeItem }) => (
  <div className="checkout-item">
    <div className="checkout-item-picture">
      <img src={item.image} alt={item.description} id="checkout-item-image" />
    </div>
    <div className="checkout-item-description">
      <p>Description: {item.description}</p>
      <div className="checkout-quantity-container">
        <div className="checkout-quantity-text">Quantity: </div>
        <div className="checkout-quantity">
          <button className="quantity-btn-minus" onClick={() => decreaseQuantity(item.id)}>-</button>
          <input type="number" className="quantity-input" value={quantity} readOnly />
          <button className="quantity-btn-plus" onClick={() => increaseQuantity(item.id)}>+</button>
        </div>
      </div>
      <button className="checkout-remove-link" onClick={() => removeItem(item.id)}>Remove</button>
      <p>Price: ${item.price.toFixed(2)}</p>
    </div>
  </div>
);

export default CheckoutItem;