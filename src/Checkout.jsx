/* useState for managing state in the component. */
/* useEffect for fetching data. */
import { useState, useEffect } from 'react';

/* React Router hook for programmatic navigation. */
import { useNavigate } from 'react-router-dom';

/* Used for making HTTP requests. */
import axios from 'axios';

/* CSS for styling the component. */
import './Checkout.css';

/* Import a component for displaying individual cart items. */
import CartItem from './CartItem';

/* Import a footer component. */
import Footer from './Footer';

/* Defines the Checkout functional component. */
function Checkout() {

  /* checkoutItems for storing items in the checkout. */
  /* setCheckoutItems to update checkoutItems. */
  const [checkoutItems, setCheckoutItems] = useState([]);

  /* ccNumber for storing the credit card number input. */
  /* setCcNumber to update ccNumber. */
  const [ccNumber, setCcNumber] = useState('');

  /* expiry for storing the expiry date input. */
  /* setExpiry to update expiry. */
  const [expiry, setExpiry] = useState('');

  /* ccv for storing the security code input. */
  /* setCcv to update ccv. */
  const [ccv, setCcv] = useState('');

  /* errors for storing form validation errors. */
  /* setErrors to update errors. */
  const [errors, setErrors] = useState({});

  /* Function for navigation. */
  const navigate = useNavigate();

  /* Runs fetchCheckoutItems */
  useEffect(() => {
    fetchCheckoutItems();
  }, []);

  /* Async function to fetch items from the cart. */
  const fetchCheckoutItems = async () => {
    try {

      /* Retrieves the access token from local storage. */
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error("No access token found");
        return;
      }

      /* Makes a GET request to /cart/items with the token in the headers. */
      const response = await axios.get('/cart/items', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Checkout Items Response:", response.data);

      /* Sets the fetched items in checkoutItems state. */
      setCheckoutItems(response.data);

      if (response.data.length === 0) {

        /* Navigates to the Cart page if no items are found. */
        navigate('/cart');
      }
    } catch (error) {
      console.error("Error fetching checkout items:", error);
      console.log("Error Response Data:", error.response ? error.response.data : 'No response data');
    }
  };

  /* Async function to increase the quantity of an item. */
  const increaseQuantity = async (itemId) => {

    /* Finds the item in checkoutItems. */
    const item = checkoutItems.find(item => item.item_id === itemId);
    if (item) {

      /* Increases the quantity by 1. */
      const newQuantity = item.quantity + 1;
      console.log(`Increasing quantity of item ${itemId} to ${newQuantity}`);

      /* Calls updateCheckoutItem to update the item on the server. */
      await updateCheckoutItem(itemId, newQuantity);
    } else {
      console.error(`Item with id ${itemId} not found`);
    }
  };

  /* Async function to decrease the quantity of an item. */
  const decreaseQuantity = async (itemId) => {

    /* Finds the item in checkoutItems. */
    const item = checkoutItems.find(item => item.item_id === itemId);

    /* Decreases the quantity by 1 if it's greater than 1. */
    if (item && item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      console.log(`Decreasing quantity of item ${itemId} to ${newQuantity}`);

      /* Calls updateCheckoutItem to update the item on the server. */
      await updateCheckoutItem(itemId, newQuantity);
    } else {
      console.error(`Item with id ${itemId} not found or quantity is less than 1`);
    }
  };

  /* Async function to update the quantity of an item. */
  const updateCheckoutItem = async (itemId, quantity) => {
    try {

      /* Retrieves the access token from local storage. */
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error("No access token found");
        return;
      }
      console.log(`Updating item ${itemId} to quantity ${quantity}`);

      /* Makes a PUT request to /cart/update with the item ID and quantity. */
      await axios.put('/cart/update', { itemId, quantity }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Item updated successfully");

      /* Calls fetchCheckoutItems to refresh the items. */
      fetchCheckoutItems();
    } catch (error) {
      console.error("Error updating checkout item:", error);
      console.log("Error Response Data:", error.response ? error.response.data : 'No response data');
    }
  };
  
  /* Async function to remove an item from the cart. */
  const removeItem = async (itemId) => {

    /* Finds the item in checkoutItems. */
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

      /* Makes a DELETE request to /cart/remove/{itemId}. */
      await axios.delete(`/cart/remove/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Item removed successfully");

      /* Calls fetchCheckoutItems to refresh the items. */
      fetchCheckoutItems();
    } catch (error) {
      console.error("Error removing checkout item:", error);
      console.log("Error Response Data:", error.response ? error.response.data : 'No response data');
    }
  };

  /* Calculates the total price of all items in the cart. */
  const totalPrice = checkoutItems.reduce((total, item) => total + (item.item.price * item.quantity), 0);

  /* Validates credit card information and returns error messages if any validation fails. */
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

  /* Checks if the provided date is valid and not in the past. */
  const isValidDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset today's date to midnight

    const [year, month, day] = date.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate >= today;
  };

  /* Async function to handle the payment process. */
  const handlePayment = async () => {

    /* Starts the timer for efficiency. */
    const startTime = Date.now();

    /* Validates payment information. */
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

        /* If no errors, sends a POST request to /checkout/payment with credit card details. */
        const response = await axios.post('/checkout/payment', { ccNumber, expiry, ccv }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        /* Displays an alert with the response message. */
        console.log("Payment Response:", response.data);
        alert(response.data.message);

        if (response.data.message === "Success! Payment has been received.") {
          console.log("Payment successful, redirecting to profile...");

          /* Redirects to the profile page if the payment is successful. */
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
    const endTime = Date.now();

    /* Ends the timer and then displays it in the console. */
    console.log(`Handling payment took ${endTime - startTime}ms`);
  };

  /* Updates the expiry state when the user changes the expiry date input. */
  const handleExpiryChange = (e) => {
    setExpiry(e.target.value);
  };

  /* Renders the component. */
  return (
    <div className="checkout-body">
      <div className="checkout-page">
        <div className="checkout-container">
          {/* Header for the checkout page */}
          <h1>CHECKOUT</h1>
          {/* Display the total price with two decimal places */}
          <p>Your Total is: ${totalPrice.toFixed(2)}</p>
          <div className="checkout-content">
            {/* Conditional rendering to show items if there are any in the cart */}
            {checkoutItems.length > 0 ? (
              checkoutItems.map(item => (
                <CartItem
                  key={item.item_id}
                  item={item}
                  // Update quantity for the item
                  updateQuantity={(newQuantity) => updateCheckoutItem(item.item_id, newQuantity)}
                  // Remove item from the cart
                  removeItem={() => removeItem(item.item_id)}
                />
              ))
            ) : (
              <div className="checkout-empty">
                <div className="checkout-empty-description">
                  <div className="checkout-empty-description-text">
                    {/* Message to display when the cart is empty */}
                    <p className="checkout-empty-item">Your Cart Is Empty</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="checkout-payment-items">
            <div className="checkout-payment-form">
              {/* Form for entering credit/debit card information */}
              <p>Credit & Debit Cards Information</p>
              <div className="checkout-fill">
                <p>
                  <label htmlFor="Credit-Card" className="checkout-payment-font">Credit Card Number*</label>
                  <input
                    type="text"
                    name="cc"
                    placeholder="Credit Card Number"
                    className={`checkout-cc ${errors.ccNumber ? 'checkout-invalid-input' : ''}`}
                    value={ccNumber}
                    onChange={(e) => setCcNumber(e.target.value)}
                  />
                  {/* Display error message for invalid credit card number */}
                  {errors.ccNumber && <span className="checkout-error">{errors.ccNumber}</span>}
                </p>
                <p>
                  <label htmlFor="Expiry" className="checkout-payment-font">Expiry*</label>
                  <input
                    type="date"
                    name="exp"
                    placeholder="yyyy-mm-dd"
                    className={`checkout-expiry ${errors.expiry ? 'checkout-invalid-input' : ''}`}
                    value={expiry}
                    onChange={handleExpiryChange}
                  />
                  {/* Display error message for invalid expiry date */}
                  {errors.expiry && <span className="checkout-error">{errors.expiry}</span>}
                </p>
                <p>
                  <label htmlFor="ccv" className="checkout-payment-font">Security Code*</label>
                  <input
                    type="text"
                    name="ccv"
                    placeholder="Security Code"
                    className={`checkout-sc ${errors.ccv ? 'checkout-invalid-input' : ''}`}
                    value={ccv}
                    onChange={(e) => setCcv(e.target.value)}
                  />
                  {/* Display error message for invalid security code */}
                  {errors.ccv && <span className="checkout-error">{errors.ccv}</span>}
                </p>
              </div>
              <p>
                {/* Button to proceed with payment */}
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

/* Exports the Checkout component */
export default Checkout;
