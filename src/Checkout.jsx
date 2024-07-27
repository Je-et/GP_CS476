import { useState, useEffect } from 'react';
import axios from 'axios';
import './Checkout.css';

import CheckoutItem from './CheckoutItem';
import Footer from './Footer';

function Checkout() {
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [ccNumber, setCcNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [ccv, setccv] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCheckoutItems();
  }, []);

  const fetchCheckoutItems = async () => {
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
    } catch (error) {
      console.error("Error fetching checkout items:", error);
      console.log("Error Response Data:", error.response ? error.response.data : 'No response data');
    }
  };

  const increaseQuantity = async (itemId) => {
    const item = checkoutItems.find(item => item.item_id === itemId);
    if (item) {
      const newQuantity = item.quantity + 1;
      console.log(`Increasing quantity of item ${itemId} to ${newQuantity}`);
      await updateCheckoutItem(itemId, newQuantity);
    } else {
      console.error(`Item with id ${itemId} not found`);
    }
  };

  const decreaseQuantity = async (itemId) => {
    const item = checkoutItems.find(item => item.item_id === itemId);
    if (item && item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      console.log(`Decreasing quantity of item ${itemId} to ${newQuantity}`);
      await updateCheckoutItem(itemId, newQuantity);
    } else {
      console.error(`Item with id ${itemId} not found or quantity is less than 1`);
    }
  };

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

  const totalPrice = checkoutItems.reduce((total, item) => total + (item.item.price * item.quantity), 0);

  const validate = () => {
    const errors = {};
    if (!ccNumber.match(/^[0-9]{16}$/)) {
      errors.ccNumber = 'Credit Card Number must be 16 digits';
    }
    if (!expiry) {
      errors.expiry = 'Expiry date is required';
    }
    if (!ccv.match(/^[0-9]{3,4}$/)) {
      errors.ccv = 'Security Code must be 3 or 4 digits';
    }
    return errors;
  };

  const handlePayment = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      try {
        const response = await axios.post('/checkout/payment', { ccNumber, expiry, ccv }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        alert(response.data.message);
      } catch (error) {
        console.error("Error processing payment:", error);
        console.log("Error Response Data:", error.response ? error.response.data : 'No response data');
      }
    }
  };

  return (
    <div className="checkout-body">
      <div className="checkout-page">
        <div className="checkout-container">
          <h1>CHECKOUT</h1>
          <p>Your Total is: ${totalPrice.toFixed(2)}</p>
          <div className="checkout-content">
            {checkoutItems.length > 0 ? (
              checkoutItems.map(item => (
                <CheckoutItem
                  key={item.item_id}
                  item={item.item}
                  quantity={item.quantity}
                  increaseQuantity={() => increaseQuantity(item.item_id)}
                  decreaseQuantity={() => decreaseQuantity(item.item_id)}
                  removeItem={() => removeItem(item.item_id)}
                />
              ))
            ) : (
              <div className="checkout-empty">
                <div className="checkout-empty-description">
                  <div className="checkout-empty-description-text">
                    <p className="checkout-empty-item">Your Cart Is Empty</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="checkout-payment-items">
            <div className="checkout-payment-form">
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
                  {errors.ccNumber && <span className="checkout-error">{errors.ccNumber}</span>}
                </p>
                <p>
                  <label htmlFor="Expiry" className="checkout-payment-font">Expiry*</label>
                  <input
                    type="date"
                    name="exp"
                    placeholder="MM/YY"
                    className={`checkout-expiry ${errors.expiry ? 'checkout-invalid-input' : ''}`}
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  />
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
                    onChange={(e) => setccv(e.target.value)}
                  />
                  {errors.ccv && <span className="checkout-error">{errors.ccv}</span>}
                </p>
              </div>
              <p>
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