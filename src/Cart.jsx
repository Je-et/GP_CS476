import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import './Cart.css';

//for temporary testing of hardcoded items
import chicken from './assets/chicken.jpg';
import steak from './assets/Steak.jpg';
import rice from './assets/Rice.jpg';
import salmon from './assets/Salmon.jpg';

import CartItem from './CartItem';
import Footer from './Footer';

//for temporary testing of hardcoded items
const initialCartItems = [
  { id: 'item1', image: chicken, description: 'Whole Chicken', price: 6.99, quantity: 5 },
  { id: 'item2', image: steak, description: 'Steak', price: 9.99, quantity: 2 },
  { id: 'item3', image: rice, description: 'White Rice', price: 4.99, quantity: 3 },
  { id: 'item4', image: salmon, description: 'Salmon', price: 5.99, quantity: 6 },
];


function Cart() {
  //for temporary testing of hardcoded items
  const [cartItems, setCartItems] = useState(initialCartItems);

  // const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // useEffect(() => {
  //   fetchCartItems();
  // }, []);

  // const fetchCartItems = async () => {
  //   try {
  //     const response = await axios.get('/cart/items', {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('access_token')}`
  //       }
  //     });
  //     setCartItems(response.data);
  //   } catch (error) {
  //     console.error("Error fetching cart items:", error);
  //   }
  // };

  // const increaseQuantity = async (id) => {
  //   const item = cartItems.find(item => item.id === id);
  //   const newQuantity = item.quantity + 1;
  //   updateCartItem(id, newQuantity);
  // };

  //for temporary testing of hardcoded items
  const increaseQuantity = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  // const decreaseQuantity = async (id) => {
  //   const item = cartItems.find(item => item.id === id);
  //   if (item.quantity > 1) {
  //     const newQuantity = item.quantity - 1;
  //     updateCartItem(id, newQuantity);
  //   }
  // };

  //for temporary testing of hardcoded items
  const decreaseQuantity = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  // const updateCartItem = async (id, quantity) => {
  //   try {
  //     await axios.put('/cart/update', { itemId: id, quantity }, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('access_token')}`
  //       }
  //     });
  //     fetchCartItems(); // Refresh cart items
  //   } catch (error) {
  //     console.error("Error updating cart item:", error);
  //   }
  // };

  // const removeItem = async (id) => {
  //   try {
  //     await axios.delete(`/cart/remove/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('access_token')}`
  //       }
  //     });
  //     fetchCartItems(); // Refresh cart items
  //   } catch (error) {
  //     console.error("Error removing cart item:", error);
  //   }
  // };

  //for temporary testing of hardcoded items
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const goToCheckout = () => {
    navigate('/checkout');
  };

  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="cart-body">
      <div className="cart-page">
        <div className="cart-container">
          <h1>YOUR CART</h1>

          <p>Your Total is: ${totalPrice.toFixed(2)}</p>

          <div className="cart-item-container">
            {cartItems.length > 0 ? (
              cartItems.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  quantity={item.quantity}
                  increaseQuantity={increaseQuantity}
                  decreaseQuantity={decreaseQuantity}
                  removeItem={removeItem}
                />
              ))
            ) : (
              <div className="cart-empty">
                <div className="cart-empty-description">
                  <div className="cart-empty-description-text">
                    <p className="cart-empty-item">Your Cart Is Empty</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button type="button" className="cart-button-checkout" onClick={goToCheckout}>Checkout</button>
          <button type="button" className="cart-button-meal">Meal Planning</button>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Cart;