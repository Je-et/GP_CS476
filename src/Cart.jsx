import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Cart.css';

import CartItem from './CartItem';


function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    checkLoginStatus();
    fetchCartItems();
  }, []);

  const checkLoginStatus = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  const fetchCartItems = async () => {
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
      console.log("Cart Items Response:", response.data);
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      console.log("Error Response Data:", error.response ? error.response.data : 'No response data');
    }
  };

  const increaseQuantity = async (itemId) => {
    const item = cartItems.find(item => item.item_id === itemId);
    if (item) {
      const newQuantity = item.quantity + 1;
      console.log(`Increasing quantity of item ${itemId} to ${newQuantity}`);
      await updateCartItem(itemId, newQuantity);
    } else {
      console.error(`Item with id ${itemId} not found`);
    }
  };

  const decreaseQuantity = async (itemId) => {
    const item = cartItems.find(item => item.item_id === itemId);
    if (item && item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      console.log(`Decreasing quantity of item ${itemId} to ${newQuantity}`);
      await updateCartItem(itemId, newQuantity);
    } else {
      console.error(`Item with id ${itemId} not found or quantity is less than 1`);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
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
      fetchCartItems();
    } catch (error) {
      console.error("Error updating cart item:", error);
      console.log("Error Response Data:", error.response ? error.response.data : 'No response data');
    }
  };

  const removeItem = async (itemId) => {
    const item = cartItems.find(item => item.item_id === itemId);
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
      fetchCartItems();
    } catch (error) {
      console.error("Error removing cart item:", error);
      console.log("Error Response Data:", error.response ? error.response.data : 'No response data');
    }
  };

  const goToCheckout = () => {
    if (!isLoggedIn) {
      alert("Must be logged in to proceed!");
      return;
    }
    navigate('/checkout');
  };

  const handleMealPlanningClick = () => {
    navigate('/mealplanning');
  };

  const totalPrice = cartItems.reduce((total, item) => total + (item.item.price * item.quantity), 0);

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
          <button type="button" className="cart-button-meal" onClick={handleMealPlanningClick}>Meal Planning</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
