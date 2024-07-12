import { useState } from 'react'
import React from 'react';
import './Checkout.css';
import chicken from './assets/chicken.jpg'
import steak from './assets/Steak.jpg'


function Checkout() {

  const [quantities, setQuantities] = useState({ item1: 5, item2: 2, item3: 5, item4: 2 });

  const increaseQuantity = (item) => {
    setQuantities({ ...quantities, [item]: quantities[item] + 1 });
  };

  const decreaseQuantity = (item) => {
    if (quantities[item] > 1) {
      setQuantities({ ...quantities, [item]: quantities[item] - 1 });
    }
  };


  return (
    <body className="checkout-body">

      <div className="checkout-page">


        <div className="checkout-container">
          <p>
            <input type="button" value="Home" className="checkout-home-button" />
          </p>
          <h1>CHECKOUT</h1>
          <div className="checkout-content">

          <div className="checkout-item">
              <div className="checkout-item-picture">
                <img src={chicken} alt="chicken" id="checkout-item-image" />
              </div>
              <div className="checkout-item-description">
      
                <p>Description: Whole Chicken</p>

                  <div className="checkout-quantity-container">

                    <div className="checkout-quantity-text">Quantity:  </div>

                    <div className="checkout-quantity">
                    <button className="quantity-btn-minus" onClick={() => decreaseQuantity('item1')}>-</button>
                    <input type="number" className="quantity-input" value={quantities.item1} readOnly />
                    <button className="quantity-btn-plus" onClick={() => increaseQuantity('item1')}>+</button>
                    </div>

                  </div>
                 
                  <a href="https://www.w3schools.com/" className="checkout-remove-link">Remove</a> 

                <p>Price: $6.99</p>
              </div>
            </div>

            <div className="checkout-item">
              <div className="checkout-item-picture">
                <img src={steak} alt="steak" id="checkout-item-image" />
              </div>
              <div className="checkout-item-description">
      
                <p>Description: Steak</p>

                  <div className="checkout-quantity-container">

                    <div className="checkout-quantity-text">Quantity:  </div>

                    <div className="checkout-quantity">
                    <button className="quantity-btn-minus" onClick={() => decreaseQuantity('item2')}>-</button>
                    <input type="number" className="quantity-input" value={quantities.item2} readOnly />
                    <button className="quantity-btn-plus" onClick={() => increaseQuantity('item2')}>+</button>
                    </div>

                  </div>
                 
                  <a href="https://www.w3schools.com/" className="checkout-remove-link">Remove</a> 

                <p>Price: $6.99</p>
              </div>
            </div>

            <div className="checkout-item">
              <div className="checkout-item-picture">
                <img src={chicken} alt="chicken" id="checkout-item-image" />
              </div>
              <div className="checkout-item-description">
      
                <p>Description: Whole Chicken</p>

                  <div className="checkout-quantity-container">

                    <div className="checkout-quantity-text">Quantity:  </div>

                    <div className="checkout-quantity">
                    <button className="quantity-btn-minus" onClick={() => decreaseQuantity('item3')}>-</button>
                    <input type="number" className="quantity-input" value={quantities.item3} readOnly />
                    <button className="quantity-btn-plus" onClick={() => increaseQuantity('item3')}>+</button>
                    </div>

                  </div>
                 
                  <a href="https://www.w3schools.com/" className="checkout-remove-link">Remove</a> 

                <p>Price: $6.99</p>
              </div>
            </div>

            <div className="checkout-item">
              <div className="checkout-item-picture">
                <img src={steak} alt="steak" id="checkout-item-image" />
              </div>
              <div className="checkout-item-description">
      
                <p>Description: Steak</p>

                  <div className="checkout-quantity-container">

                    <div className="checkout-quantity-text">Quantity:  </div>

                    <div className="checkout-quantity">
                    <button className="quantity-btn-minus" onClick={() => decreaseQuantity('item4')}>-</button>
                    <input type="number" className="quantity-input" value={quantities.item4} readOnly />
                    <button className="quantity-btn-plus" onClick={() => increaseQuantity('item4')}>+</button>
                    </div>

                  </div>
                 
                  <a href="https://www.w3schools.com/" className="checkout-remove-link">Remove</a> 

                <p>Price: $6.99</p>
              </div>
            </div>

            <p>Your Total is: $100</p>

             
          </div>
          
          <div className="checkout-payment-items">
            <div className="checkout-payment-form">
              <p> Credit & Debit Cards Information </p>

              <div className="checkout-fill">
                <p>
                  <label htmlFor="Credit-Card" className="checkout-payment-font">Credit Card Number*  </label>
                  <input type="text" name="cc" placeholder="Credit Card Number" className="checkout-cc" />
                </p>
                <p>
                  <label htmlFor="Expiry" className="checkout-payment-font">Expiry*  </label>
                  <input type="date" name="exp" placeholder="MM/YY" className="checkout-expiry"/>
                </p>
                <p>
                  <label htmlFor="csc" className="checkout-payment-font">Security Code*  </label>
                  <input type="text" name="csc" placeholder="Security Code" className="checkout-sc"/>
                </p>
              </div>

              <p>
                <input type="button" value="Proceed Payment" className="checkout-payment-button" />
              </p>
            </div>
          </div>

        </div>
        <footer>&copy; Green Basket 2024</footer>
      </div>


    </body>
      
  );
}

export default Checkout;
