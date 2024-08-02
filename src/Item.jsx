/* Essential for creating React components. */
import React from 'react';

/* CSS style for Item component. */
import './Item.css';

/* Used for sending HTTP Requests */
import axios from 'axios';

/* Provides notifications to the user. */
import { toast } from 'react-toastify';


/* Contains data about the item */
function Item({ item, updateCartCount, handleItemSelect }) {

  /* Perform other actions when the item is clicked. */
  const handleItemClick = () => {

    /* A function to handle what happens when an item is selected. */
    handleItemSelect(item.id);
  };

  /* Determines the URL of the image based on the input picture. */
  const getImageUrl = (picture) => {

    /* Returns a placeholder image URL. */
    if (!picture) return 'https://via.placeholder.com/100';

    /* Returns the URL as-is */
    if (picture.startsWith('http')) return picture;

    /* Constructs a full URL if the picture path is relative. */
    if (picture.startsWith('/')) return `http://localhost:5000${picture}`;
    return `http://localhost:5000/items/image/${encodeURIComponent(picture)}`;
  };

  const addToCart = async (event, itemId) => {

    /* Prevents the item click event from being triggered when the button is clicked. */
    event.stopPropagation();

    try {
      const token = localStorage.getItem('access_token');

      /* Sends a POST request to add the item to the cart with the current item ID and quantity. */
      const response = await axios.post('http://localhost:5000/cart/add', {
        itemId,
        quantity: 1
      }, {
        headers: {

          /*  Includes the JWT token for authentication. */
          Authorization: `Bearer ${token}`
        }
      });

      /* Logs the response or error and provides feedback to the user using toast. */
      console.log('Item added to cart:', response.data);
      toast.success('Item added to cart!');
      updateCartCount(1);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      toast.error('Failed to add item to cart. Please try again.');
    }
    
  };

  return (
    /* The main container for the item. Clicking on it triggers handleItemClick. */
    <div className="item" onClick={handleItemClick}>
      <div className="item-content">
        
        {/* Contains the item image and any discount badge. */}
        <div className="item-picture">
          <img

            /* Displays the item image */
            src={getImageUrl(item.picture)}
            alt={item.name}
            onError={(e) => {
              console.error('Error loading image:', e.target.src);
              e.target.src = 'https://via.placeholder.com/100';
            }}
          />

          {/* Conditionally displayed if there is a discount. */}
          {item.discount > 0 && (
            <div className="item-discount-badge">
              {item.discount}% OFF
            </div>
          )}
        </div>

        {/* Contains item details like name, price, and original price if discounted. */}
        <div className="item-details">
          <div className="item-name">{item.name}</div>
          <div className="item-price">
            ${item.price.toFixed(2)}
            {item.discount > 0 && (
              <span className="item-original-price">
                ${(item.price / (1 - item.discount / 100)).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Calls addToCart to add the item to the cart when clicked. */}
      <button className="add-to-cart-button" onClick={(e) => addToCart(e, item.id)}>
        Add to Cart
      </button>
    </div>
  );
}

/* Exports the Item component so it can be used in other parts of the website. */
export default Item;