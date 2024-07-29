import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Cart.css';
import CartItem from './CartItem';
import { toast } from 'react-toastify';

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
    setIsLoggedIn(!!token);
  };

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No access token found');
        return;
      }
      const response = await axios.get('/cart/items', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error('Failed to fetch cart items. Please try again.');
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Please log in to update your cart.');
        return;
      }
      await axios.put(
        '/cart/update',
        { itemId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCartItems();
      toast.success('Cart updated successfully');
    } catch (error) {
      console.error('Error updating cart item:', error);
      toast.error('Failed to update cart. Please try again.');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Please log in to remove items from your cart.');
        return;
      }
      await axios.delete(`/cart/remove/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCartItems();
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing cart item:', error);
      toast.error('Failed to remove item. Please try again.');
    }
  };

  const goToCheckout = () => {
    if (!isLoggedIn) {
      toast.error('Please log in to proceed to checkout.');
      return;
    }
    if (cartItems.length === 0) {
      toast.info('Your cart is empty.');
      return;
    }
    navigate('/checkout');
  };

  const handleMealPlanningClick = () => {
    navigate('/mealplanning');
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.item.price * item.quantity,
    0
  );

  return (
    <div className="cart-body">
      <div className="cart-page">
        <div className="cart-container">
          <h1 className="cart-title">Your Cart</h1>
          <div className="cart-total">Total: ${totalPrice.toFixed(2)}</div>
          <div className="cart-item-container">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <CartItem
                  key={item.item.id}
                  item={item}
                  updateQuantity={(quantity) => updateCartItem(item.item_id, quantity)}
                  removeItem={() => removeItem(item.item_id)}
                />
              ))
            ) : (
              <div className="cart-empty">
                <p className="cart-empty-item">Your Cart Is Empty</p>
              </div>
            )}
          </div>
          <div className="cart-actions">
            <button type="button" className="cart-button-checkout" onClick={goToCheckout}>
              Proceed to Checkout
            </button>
            <button type="button" className="cart-button-meal" onClick={handleMealPlanningClick}>
              Meal Planning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;