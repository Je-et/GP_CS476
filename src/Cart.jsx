import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Cart.css';

import CartItem from './CartItem';
import Footer from './Footer';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('access_token');
      console.log("Access Token:", token); // Log the token
      const response = await axios.get('/cart/items', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Cart Items Response:", response.data); // Log the response data
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      console.log("Error Response Data:", error.response ? error.response.data : 'No response data');
    }
  };

  const increaseQuantity = async (id) => {
    const item = cartItems.find(item => item.id === id);
    const newQuantity = item.quantity + 1;
    updateCartItem(id, newQuantity);
  };

  const decreaseQuantity = async (id) => {
    const item = cartItems.find(item => item.id === id);
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      updateCartItem(id, newQuantity);
    }
  };

  const updateCartItem = async (id, quantity) => {
    try {
      await axios.put('/cart/update', { itemId: id, quantity }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      fetchCartItems(); // Refresh cart items
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(`/cart/remove/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      fetchCartItems(); // Refresh cart items
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  const goToCheckout = () => {
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
          <button type="button" className="cart-button-meal" onClick={handleMealPlanningClick}>Meal Planning</button>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Cart;
