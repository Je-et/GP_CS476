import React from 'react';

function CartItem({ item, increaseQuantity, decreaseQuantity, removeItem }) {
  return (
    <div className="cart-item">
      <div className="cart-item-picture">
        <img src={item.item.image} alt={item.item.description} id="cart-item-image" />
      </div>
      <div className="cart-item-description">
        <p>Description: {item.item.name}</p>
        <div className="cart-quantity-container">
          <div className="cart-quantity-text">Quantity: </div>
          <div className="cart-quantity">
            <button className="quantity-btn-minus" onClick={() => { console.log(`Decreasing quantity of item ${item.item_id}`); decreaseQuantity(item.item_id); }}>-</button>
            <input type="number" className="quantity-input" value={item.quantity} readOnly />
            <button className="quantity-btn-plus" onClick={() => { console.log(`Increasing quantity of item ${item.item_id}`); increaseQuantity(item.item_id); }}>+</button>
          </div>
        </div>
        <button className="cart-remove-link" onClick={() => { console.log(`Removing item ${item.item_id}`); removeItem(item.item_id); }}>Remove</button>
        <p>Price: ${item.item.price.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default CartItem;
