import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ItemDetail.css';
import { toast } from 'react-toastify';

function ItemDetail({itemId, updateCartCount, onClose}) {
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/items/${itemId}`);
        setItem(response.data);
      } catch (error) {
        console.error('Error fetching item details:', error);
      }
    };

    if (itemId) {
      fetchItem();
    }
  }, [itemId]);

  const addToCart = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post('http://localhost:5000/cart/add', {
        itemId: item.id,
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

  if (!item) {
    return null;
  }

  return (
    <div className="item-detail-overlay" onClick={onClose}>
      <div className="item-detail-popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <div className="item-detail-content">
          <img src={item.picture || 'https://via.placeholder.com/100'} alt={item.name} className="item-detail-image" />
          <div className="item-detail-info">
            <h2>{item.name}</h2>
            <p className="item-description">{item.description}</p>
            <p className="item-price">Price: ${item.price.toFixed(2)}</p>
            {item.discount > 0 && <p className="item-discount">Save {item.discount}% OFF</p>}
            <p className="item-attribute">Calories: {item.calorie}</p>
            <p className="item-attribute">Vegan: {item.vegan ? 'Yes' : 'No'}</p>
            <p className="item-attribute">Gluten Free: {item.glutenFree ? 'Yes' : 'No'}</p>
            <button className="add-to-cart" onClick={addToCart}>Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;