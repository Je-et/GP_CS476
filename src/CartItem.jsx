import React from 'react';

const CartItem = ({ item, quantity, increaseQuantity, decreaseQuantity, removeItem }) => (
  <div className="cart-item">
    <div className="cart-item-picture">
      <img src={item.image} alt={item.description} id="cart-item-image" />
    </div>
    <div className="cart-item-description">
      <p>Description: {item.description}</p>
      <div className="cart-quantity-container">
        <div className="cart-quantity-text">Quantity: </div>
        <div className="cart-quantity">
          <button className="quantity-btn-minus" onClick={() => decreaseQuantity(item.id)}>-</button>
          <input type="number" className="quantity-input" value={quantity} readOnly />
          <button className="quantity-btn-plus" onClick={() => increaseQuantity(item.id)}>+</button>
        </div>
      </div>
      <button className="cart-remove-link" onClick={() => removeItem(item.id)}>Remove</button>
      <p>Price: ${item.price.toFixed(2)}</p>
    </div>
  </div>
);

export default CartItem;