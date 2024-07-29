import React from 'react';
import './Item.css';
import axios from 'axios';
import { toast } from 'react-toastify';

function Item({ item, updateCartCount, handleItemSelect }) {

  const handleItemClick = () => {
    handleItemSelect(item.id);
  };

  const addToCart = async (event, itemId) => {
    event.stopPropagation(); // Prevent the item click event from firing
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post('http://localhost:5000/cart/add', {
        itemId,
        quantity: 1
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Item added to cart:', response.data);
      toast.success('Item added to cart!');
      updateCartCount(1);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      toast.error('Failed to add item to cart. Please try again.');
    }
  };

  return (
    <div className="item" onClick={handleItemClick}>
      <div className="item-content">
        <div className="item-picture">
          <img src={item.picture || 'https://via.placeholder.com/100'} alt={item.name} />
          {item.discount > 0 && (
            <div className="item-discount-badge">
              {item.discount}% OFF
            </div>
          )}
        </div>
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
      <button className="add-to-cart-button" onClick={(e) => addToCart(e, item.id)}>
        Add to Cart
      </button>
    </div>
  );
}

export default Item;