/* Necessary to define and use React components. */
import React from 'react';

/* Defines a functional component named CheckoutItem that receives item, quantity, increaseQuantity, decreaseQuantity, and removeItem as props. */
const CheckoutItem = ({ item, quantity, increaseQuantity, decreaseQuantity, removeItem }) => (

  /* Wraps the entire component in a div with the class checkout-item for styling and layout purposes. */
  <div className="checkout-item">

    {/* Displays the item's image. */}
    <div className="checkout-item-picture">
      <img src={item.image} alt={item.description} id="checkout-item-image" />
    </div>

    {/* Shows the item's description. */}
    <div className="checkout-item-description">
      <p>Description: {item.name}</p>

      {/* Provides controls for adjusting the item's quantity. */}
      <div className="checkout-quantity-container">
        <div className="checkout-quantity-text">Quantity: </div>
        <div className="checkout-quantity">
          <button className="quantity-btn-minus" onClick={() => decreaseQuantity(item.id)}>-</button>
          <input type="number" className="quantity-input" value={quantity} readOnly />
          <button className="quantity-btn-plus" onClick={() => increaseQuantity(item.id)}>+</button>
        </div>
      </div>

      {/* Removes the item from the cart when clicked, invoking removeItem with the item's ID. */}
      <button className="checkout-remove-link" onClick={() => removeItem(item.id)}>Remove</button>

      {/* Displays the item's price, formatted to two decimal places. */}
      <p>Price: ${item.price.toFixed(2)}</p>
    </div>
  </div>
);

/* Exports the CheckoutItem component */
export default CheckoutItem;