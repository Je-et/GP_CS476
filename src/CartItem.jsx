/* Imports React to create the functional component. */
import React from 'react';



function CartItem({ item, updateQuantity, removeItem }) {
  const getImageUrl = (picture) => {

    /* A function to get the correct image URL based on the picture string. */
    if (!picture) return 'https://via.placeholder.com/100';

    /*  Returns the picture URL if it starts with 'http'. */
    if (picture.startsWith('http')) return picture;

    /* Returns a full URL by appending the local server address if picture starts with a '/'. */
    if (picture.startsWith('/')) return `http://localhost:5000${picture}`;

    /* Encodes the picture string and constructs a URL pointing to the local server's image endpoint. */
    return `http://localhost:5000/items/image/${encodeURIComponent(picture)}`;
  };
  
  /* Logs the item data to the console for debugging purposes. */
  console.log('CartItem data:', item);

  return (
    <div className="cart-item">
      <div className="cart-item-picture">
        <img

          /* Sets the image source using the getImageUrl function. */
          src={getImageUrl(item.item.picture)}

          /* Sets the alt text of the image. */
          alt={item.item.name}

          /* Error handler for the image. If loading fails, logs an error and sets the image source to a placeholder. */
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
          Remove
        </button>
      </div>
    </div>
  );
}

/* Exports the CartItem component so it can be used in other parts of the website. */
export default CartItem;