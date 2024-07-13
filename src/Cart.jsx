import { useState } from 'react'
// import { Routes, Route, useNavigate } from 'react-router-dom'
// import Checkout from './Checkout'
import { useNavigate } from 'react-router-dom';
import './Cart.css'
import chicken from './assets/chicken.jpg'
import steak from './assets/Steak.jpg'



function Cart() {
  const [quantities, setQuantities] = useState({ item1: 5, item2: 2, item3: 5, item4: 2 });

  const increaseQuantity = (item) => {
    setQuantities({ ...quantities, [item]: quantities[item] + 1 });
  };

  const decreaseQuantity = (item) => {
    if (quantities[item] > 1) {
      setQuantities({ ...quantities, [item]: quantities[item] - 1 });
    }
  };

  const navigate = useNavigate();
  const goToCheckout = () => {
    navigate('/checkout');
  };

  // const navigate1 = useNavigate();
  // const goToHome = () => {
  //   navigate('/app');
  // };

  // <button type="button" className="cart-home-button" onClick={goToHome}>Home</button>

  return (

    
      <body className="cart-body">
        <div className="cart-page">

        <div className="cart-container">
          
          <h1>YOUR CART</h1>

          <div className="cart-item-container">

          <div className="cart-item">
              <div className="cart-item-picture">
                <img src={chicken} alt="chicken" id="cart-item-image" />
              </div>
              <div className="cart-item-description">
      
                <p>Description: Whole Chicken</p>

                  <div className="cart-quantity-container">

                    <div className="cart-quantity-text">Quantity:  </div>

                    <div className="cart-quantity">
                    <button className="quantity-btn-minus" onClick={() => decreaseQuantity('item1')}>-</button>
                    <input type="number" className="quantity-input" value={quantities.item1} readOnly />
                    <button className="quantity-btn-plus" onClick={() => increaseQuantity('item1')}>+</button>
                    </div>

                  </div>
                 
                  <a href="https://www.w3schools.com/" className="cart-remove-link">Remove</a> 

                <p>Price: $6.99</p>
              </div>
            </div>


            <div className="cart-item">
              <div className="cart-item-picture">
                <img src={steak} alt="steak" id="cart-item-image" />
              </div>
              <div className="cart-item-description">

                <p>Description: Steak</p>

                <div className="cart-quantity-container">

                    <div className="cart-quantity-text">Quantity:  </div>

                    <div className="cart-quantity">
                    <button className="quantity-btn-minus" onClick={() => decreaseQuantity('item2')}>-</button>
                    <input type="number" className="quantity-input" value={quantities.item2} readOnly />
                    <button className="quantity-btn-plus" onClick={() => increaseQuantity('item2')}>+</button>
                    </div>

                  </div>

                  <a href="https://www.w3schools.com/" className="cart-remove-link">Remove</a> 

                <p>Price: $9.99</p>
              </div>
            </div>

            <div className="cart-item">
              <div className="cart-item-picture">
                <img src={chicken} alt="chicken" id="cart-item-image" />
              </div>
              <div className="cart-item-description">
                
                <p>Description: Whole Chicken</p>

                <div className="cart-quantity-container">

                    <div className="cart-quantity-text">Quantity:  </div>

                    <div className="cart-quantity">
                    <button className="quantity-btn-minus" onClick={() => decreaseQuantity('item3')}>-</button>
                    <input type="number" className="quantity-input" value={quantities.item3} readOnly />
                    <button className="quantity-btn-plus" onClick={() => increaseQuantity('item3')}>+</button>
                    </div>

                  </div>

                  <a href="https://www.w3schools.com/" className="cart-remove-link">Remove</a> 

                <p>Price: $6.99</p>
              </div>
            </div>

            <div className="cart-item">
              <div className="cart-item-picture">
                <img src={steak} alt="steak" id="cart-item-image" />
              </div>
              <div className="cart-item-description">
                
                <p>Description: Steak</p>

                <div className="cart-quantity-container">

                    <div className="cart-quantity-text">Quantity:  </div>

                    <div className="cart-quantity">
                    <button className="quantity-btn-minus" onClick={() => decreaseQuantity('item4')}>-</button>
                    <input type="number" className="quantity-input" value={quantities.item4} readOnly />
                    <button className="quantity-btn-plus" onClick={() => increaseQuantity('item4')}>+</button>
                    </div>

                  </div>

                  <a href="https://www.w3schools.com/" className="cart-remove-link">Remove</a> 


                <p>Price: $9.99</p>
              </div>
            </div>

            <p>Your Total is: $100</p>
            
          </div>

          
          <button type="button" className="cart-button-checkout" onClick={goToCheckout}>Checkout</button>
          <button type="button" className="cart-button-meal">Meal Planning</button>
        </div>

        <footer>&copy; Green Basket 2024</footer>
      </div>


      </body>


  )
}


// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/checkout" element={<Checkout />} />
//     </Routes>
//   )
// }

export default Cart;
