import React from 'react';

function CartItem({ item, updateQuantity, removeItem }) {
  const getImageUrl = (picture) => {
    if (!picture) return 'https://via.placeholder.com/100';
    if (picture.startsWith('http')) return picture;
    if (picture.startsWith('/')) return `http://localhost:5000${picture}`;
    return `http://localhost:5000/items/image/${encodeURIComponent(picture)}`;
  };
  
  console.log('CartItem data:', item); // Add this line for debugging

  return (
    <div className="cart-item">
      <div className="cart-item-picture">
        <img
          src={getImageUrl(item.item.picture)}
          alt={item.item.name}
          onError={(e) => {
            console.error('Error loading image:', e.target.src);
            e.target.src = 'https://via.placeholder.com/100';
          }}
        />
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
          onClick={removeItem}
        >
          x
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItem;