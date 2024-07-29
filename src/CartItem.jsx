import React from 'react';

function CartItem({ item, updateQuantity, removeItem }) {
  return (
    <div className="cart-item">
      <div className="cart-item-picture">
        <img src={item.item.image} alt={item.item.name} id="cart-item-image" />
      </div>
      <div className="cart-item-description">
        <h3 className="cart-item-name">{item.item.name}</h3>
        <p className="cart-item-price">${item.item.price.toFixed(2)}</p>
        <div className="cart-quantity-container">
          <button 
            className="quantity-btn" 
            onClick={() => updateQuantity(item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <input 
            type="number" 
            className="quantity-input" 
            value={item.quantity} 
            readOnly 
          />
          <button 
            className="quantity-btn" 
            onClick={() => updateQuantity(item.quantity + 1)}
          >
            +
          </button>
        </div>
        <button 
          className="cart-remove-btn" 
          onClick={() => removeItem()}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItem;