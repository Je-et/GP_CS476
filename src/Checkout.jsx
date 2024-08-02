/* Essential for creating React components. */
import { useState, useEffect, useCallback } from 'react';

/* For routing and navigation. */
import { useNavigate } from 'react-router-dom';

/* Used for sending HTTP Requests */
import axios from 'axios';

/* CSS styling for the Checkout components */
import './Checkout.css';

/* Imports Cart Item component */
import CartItem from './CartItem';

/* Import Footer component */
import Footer from './Footer';

function Checkout() {
  /* Stores the items currently in the user's cart. */
  const [checkoutItems, setCheckoutItems] = useState([]);
  /* Store the credit card information entered by the user. */
  const [ccNumber, setCcNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [ccv, setCcv] = useState('');
  /* Stores validation error messages for the payment information. */
  const [errors, setErrors] = useState({});
  /* Used for navigation throughout the page. */
  const navigate = useNavigate();

  /* This function fetches the items in the cart from the backend and updates the checkoutItems state. */
  const fetchCheckoutItems = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error("No access token found");
        return;
      }

      const response = await axios.get('/cart/items', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Checkout Items Response:", response.data);
      setCheckoutItems(response.data);

      if (response.data.length === 0) {
        /* If no items are found, it redirects the user to the cart page. */
        navigate('/cart');
      }
    } catch (error) {
      console.error("Error fetching checkout items:", error);
      console.log("Error Response Data:", error.response ? error.response.data : 'No response data');
    }
  }, [navigate]);

  /* Ensures that the cart items are fetched when the component is first rendered. */
  useEffect(() => {
    fetchCheckoutItems();
  }, [fetchCheckoutItems]);

  /* Updates the quantity of an item in the cart. After updating, it fetches the updated cart items. */
  const updateCheckoutItem = async (itemId, quantity) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error("No access token found");
        return;
      }
      console.log(`Updating item ${itemId} to quantity ${quantity}`);
      await axios.put('/cart/update', { itemId, quantity }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Item updated successfully");
      fetchCheckoutItems();
    } catch (error) {
      console.error("Error updating checkout item:", error);
      console.log("Error Response Data:", error.response ? error.response.data : 'No response data');
    }
  };

  /* Removes an item from the cart. If the item is successfully removed, it fetches the updated cart items. */
  const removeItem = async (itemId) => {
    const item = checkoutItems.find(item => item.item_id === itemId);
    if (!item) {
      console.error(`Item with id ${itemId} not found`);
      return;
    }
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error("No access token found");
        return;
      }
      console.log(`Removing item ${itemId}`);
      await axios.delete(`/cart/remove/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Item removed successfully");
      fetchCheckoutItems();
    } catch (error) {
      console.error("Error removing checkout item:", error);
      console.log("Error Response Data:", error.response ? error.response.data : 'No response data');
    }
  };

  /* Calculates the total price */
  const totalPrice = checkoutItems.reduce((total, item) => total + (item.item.price * item.quantity), 0);

  /* Validates the credit card number, expiry date, and security code. Returns an object with error messages if any validation checks fail. */
  const validate = () => {
    const errors = {};
    if (!ccNumber.match(/^[0-9]{16}$/)) {
      errors.ccNumber = 'Credit Card Number must be 16 digits';
    }
    if (!expiry.match(/^\d{4}-\d{2}-\d{2}$/) || !isValidDate(expiry)) {
      errors.expiry = 'Expiry date must be valid';
    }
    if (!ccv.match(/^[0-9]{3,4}$/)) {
      errors.ccv = 'Security Code must be 3 or 4 digits';
    }
    return errors;
  };

  const isValidDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [year, month, day] = date.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    selectedDate.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  };

  /* Validates the payment information */
  const handlePayment = async () => {
    /* Starts the timer for efficiency */
    const startTime = Date.now();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.error("No access token found");
          return;
        }

        /* makes a POST request to process the payment */
        const response = await axios.post('/checkout/payment', { ccNumber, expiry, ccv }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log("Payment Response:", response.data);
        alert(response.data.message);

        if (response.data.message === "Success! Payment has been received.") {
          console.log("Payment successful, redirecting to profile...");
          /*  If the payment is successful, it redirects the user to the profile page. */
          navigate('/profile');
        } else {
          console.log("Payment was not successful, no redirection.");
        }
      } catch (error) {
        console.error("Error processing payment:", error);
        console.log("Error Response Data:", error.response ? error.response.data : 'No response data');
        if (error.response && error.response.data) {
          alert(error.response.data.message || "Payment failed");
        }
      }
    }
    /* Stops the timer */
    const endTime = Date.now();
    console.log(`Handling payment took ${endTime - startTime}ms`);
  };

  const handleExpiryChange = (e) => {
    setExpiry(e.target.value);
  };

  return (
    <div className="checkout-body">
      {/*  A container for the entire checkout page content. */}
      <div className="checkout-page">
        {/* A container for layout and styling of the content inside the page. */}
        <div className="checkout-container">
          <h1>CHECKOUT</h1>
          <p>Your Total is: ${totalPrice.toFixed(2)}</p>
          {/* Container for displaying cart items or an empty state message. */}
          <div className="checkout-content">
            {/* Checks if there are items in the cart. */}
            {checkoutItems.length > 0 ? (
              checkoutItems.map(item => (
                /* Maps over checkoutItems and renders a CartItem component for each item.*/
                <CartItem
                  key={item.item_id}
                  item={item}
                  updateQuantity={(newQuantity) => updateCheckoutItem(item.item_id, newQuantity)}
                  removeItem={() => removeItem(item.item_id)}
                />
              ))
            ) : (
              <div className="checkout-empty">
                <div className="checkout-empty-description">
                  {/* Displays a message indicating that the cart is empty. */}
                  <div className="checkout-empty-description-text">
                    <p className="checkout-empty-item">Your Cart Is Empty</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Containers for the payment form elements. */}
          <div className="checkout-payment-items">
            <div className="checkout-payment-form">
              <p>Credit & Debit Cards Information</p>
              <div className="checkout-fill">
                <p>
                  <label htmlFor="Credit-Card" className="checkout-payment-font">Credit Card Number*</label>
                  {/* A text input for entering the credit card number, with validation errors displayed below if any. */}
                  <input
                    type="text"
                    name="cc"
                    placeholder="Credit Card Number"
                    className={`checkout-cc ${errors.ccNumber ? 'checkout-invalid-input' : ''}`}
                    value={ccNumber}
                    onChange={(e) => setCcNumber(e.target.value)}
                  />
                  {errors.ccNumber && <span className="checkout-error">{errors.ccNumber}</span>}
                </p>
                <p>
                  <label htmlFor="Expiry" className="checkout-payment-font">Expiry*</label>
                  {/* Input field for selecting the expiry date. */}
                  <input
                    type="date"
                    name="exp"
                    placeholder="yyyy-mm-dd"
                    className={`checkout-expiry ${errors.expiry ? 'checkout-invalid-input' : ''}`}
                    value={expiry}
                    onChange={handleExpiryChange}
                  />
                  {errors.expiry && <span className="checkout-error">{errors.expiry}</span>}
                </p>
                <p>
                  <label htmlFor="ccv" className="checkout-payment-font">Security Code*</label>
                  {/* Text input for entering the security code, with validation errors displayed if any.*/}
                  <input
                    type="text"
                    name="ccv"
                    placeholder="Security Code"
                    className={`checkout-sc ${errors.ccv ? 'checkout-invalid-input' : ''}`}
                    value={ccv}
                    onChange={(e) => setCcv(e.target.value)}
                  />
                  {errors.ccv && <span className="checkout-error">{errors.ccv}</span>}
                </p>
              </div>
              <p>
                {/* Button to trigger the payment process. When clicked, it calls the handlePayment function. */}
                <input
                  type="button"
                  value="Proceed Payment"
                  className="checkout-payment-button"
                  onClick={handlePayment}
                />
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Checkout;
