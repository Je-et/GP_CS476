import { useState, useEffect } from 'react';
// import axios from 'axios';
import './Checkout.css';

//for temporary testing of hardcoded items
import chicken from './assets/chicken.jpg';
import steak from './assets/Steak.jpg';
import rice from './assets/Rice.jpg';
import salmon from './assets/Salmon.jpg';

import CheckoutItem from './CheckoutItem';

//for temporary testing of hardcoded items
const initialCheckoutItems = [
  { id: 'item1', image: chicken, description: 'Whole Chicken', price: 6.99, quantity: 5 },
  { id: 'item2', image: steak, description: 'Steak', price: 9.99, quantity: 2 },
  { id: 'item3', image: rice, description: 'White Rice', price: 4.99, quantity: 3 },
  { id: 'item4', image: salmon, description: 'Salmon', price: 5.99, quantity: 6 },
];

function Checkout() {
  //for temporary testing of hardcoded items
  const [checkoutItems, setCheckoutItems] = useState(initialCheckoutItems);

  // const [checkoutItems, setCheckoutItems] = useState([]);
  const [ccNumber, setCcNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [csc, setCsc] = useState('');
  const [errors, setErrors] = useState({});

  // useEffect(() => {
  //   fetchCheckoutItems();
  // }, []);

  // const fetchCheckoutItems = async () => {
  //   try {
  //     const response = await axios.get('/api/checkout/items', {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('access_token')}`
  //       }
  //     });
  //     setCheckoutItems(response.data);
  //   } catch (error) {
  //     console.error("Error fetching checkout items:", error);
  //   }
  // };

  const increaseQuantity = (id) => {
    setCheckoutItems(checkoutItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQuantity = (id) => {
    setCheckoutItems(checkoutItems.map(item =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const removeItem = (id) => {
    setCheckoutItems(checkoutItems.filter(item => item.id !== id));
  };

  const totalPrice = checkoutItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const validate = () => {
    const errors = {};
    if (!ccNumber.match(/^[0-9]{16}$/)) {
      errors.ccNumber = 'Credit Card Number must be 16 digits';
    }
    if (!expiry) {
      errors.expiry = 'Expiry date is required';
    }
    if (!csc.match(/^[0-9]{3,4}$/)) {
      errors.csc = 'Security Code must be 3 or 4 digits';
    }
    return errors;
  };

  const handlePayment = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      // try {
      //   const response = await axios.post('/api/checkout/payment', { ccNumber, expiry, csc }, {
      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem('access_token')}`
      //     }
      //   });
      //   alert(response.data.message);
      // } catch (error) {
      //   console.error("Error processing payment:", error);
      // }

      //for temporary testing of hardcoded items
      alert("Payment successful!");
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
                  key={item.id}
                  item={item}
                  quantity={item.quantity}
                  increaseQuantity={increaseQuantity}
                  decreaseQuantity={decreaseQuantity}
                  removeItem={removeItem}
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
                  <label htmlFor="csc" className="checkout-payment-font">Security Code*</label>
                  <input
                    type="text"
                    name="csc"
                    placeholder="Security Code"
                    className={`checkout-sc ${errors.csc ? 'checkout-invalid-input' : ''}`}
                    value={csc}
                    onChange={(e) => setCsc(e.target.value)}
                  />
                  {errors.csc && <span className="checkout-error">{errors.csc}</span>}
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
      </div>
    </div>
  );
}

export default Checkout;