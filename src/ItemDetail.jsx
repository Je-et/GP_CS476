/* Essential for creating React components. */
import React, { useEffect, useState } from 'react';

/* Used for making HTTP requests. */
import axios from 'axios';

/* CSS styles for ItemDetail component. */
import './ItemDetail.css';

/* For showing toast notifications. */
import { toast } from 'react-toastify';

/* Defines the ItemDetail component. */
function ItemDetail({ itemId, updateCartCount, onClose }) {

  /* 'item' is used to store items in the 'item' */
  /* 'setItem' is used to update 'item' */
  const [item, setItem] = useState(null);

  /* Fetches item details when the component mounts or when itemId changes. */
  useEffect(() => {

    /*  Asynchronously fetches data from the server. */
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/items/${itemId}`);

        /* Updates the item state. */
        setItem(response.data);

      } catch (error) {

        /* Logs any errors that occur during the fetch operation. */
        console.error('Error fetching item details:', error);
      }
    };

    /* Ensures that data is only fetched if itemId is provided. */
    if (itemId) {
      fetchItem();
    }
  }, [itemId]);

  /* Adds the item to the cart and updates the cart count. */
  const addToCart = async () => {
    try {

      /* Retrieves the authorization token from local storage. */
      const token = localStorage.getItem('access_token');

      /* Sends a POST request to add the item to the cart. */
      const response = await axios.post('http://localhost:5000/cart/add', {
        itemId: item.id,
        quantity: 1
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      /* Shows toast notifications based on the success or failure of the operation. */
      console.log('Item added to cart:', response.data);
      toast.success('Item added to cart!');
      updateCartCount(1);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      toast.error('Failed to add item to cart. Please try again.');
    }
  };

  /* Renders nothing if the item data is not yet available. This prevents rendering the modal with incomplete data. */
  if (!item) {
    return null;
  }

  return (

    /* Renders the item detail overlay with the fetched item data. */
    <div className="item-detail-overlay" onClick={onClose}>

      {/* Container for the item details that appears centered on the screen. */}
      <div className="item-detail-popup" onClick={(e) => e.stopPropagation()}>

        {/* Button to close. */}
        <button className="close-button" onClick={onClose}>×</button>

        {/* Main content including item image and details.*/}
        <div className="item-detail-content">
          <div
            /*  Displays the item's image */
            className="item-detail-image-container"
            style={{
              backgroundImage: `url(${item.picture ? `http://localhost:5000/items/image/${encodeURIComponent(item.picture)}` : 'https://via.placeholder.com/300'})`
            }}
          />

          {/* Contains item details. */}
          <div className="item-detail-info">
            <h2>{item.name}</h2>
            <p className="item-description">{item.description}</p>
            <p className="item-price">Price: ${item.price.toFixed(2)}</p>
            {item.discount > 0 && <p className="item-discount">Save {item.discount}% OFF</p>}
            <p className="item-attribute">Calories: {item.calorie}</p>
            <p className="item-attribute">Vegan: {item.vegan ? 'Yes' : 'No'}</p>
            <p className="item-attribute">Gluten Free: {item.glutenFree ? 'Yes' : 'No'}</p>

            {/* Triggers the addToCart function to add the item to the cart. */ }
            <button className="add-to-cart" onClick={addToCart}>Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
      );
}

    /* Exports the Item Detail component so it can be used in other parts of the application. */
      export default ItemDetail;