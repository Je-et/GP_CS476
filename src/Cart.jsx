/* useState and useEffect for managing states */
import React, { useState, useEffect } from 'react';

/* Used for navigation within the app. */
import { useNavigate } from 'react-router-dom';

/* Used for making HTTP requests */
import axios from 'axios';

/* Imports the CSS file for styling the component. */
import './Cart.css';

/* Imports the CartItem component that is used to display the individual cart items. */
import CartItem from './CartItem';

/* Imports the toast function for showing notifications. */
import { toast } from 'react-toastify';


function Cart() {

  /* Initializes cartItems state to an empty array to store cart items. */
  const [cartItems, setCartItems] = useState([]);

  /* Initializes isLoggedIn state to 'false' to track user's login status. */
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* Function for navigation. */
  const navigate = useNavigate();

  useEffect(() => {
    checkLoginStatus();
    fetchCartItems();
  }, []);

  const checkLoginStatus = () => {
    
    /* Retrieves the access token from the local storage. */
    const token = localStorage.getItem('access_token');

    /* Sets isLoggedIn to true if the token exists, otherwise false. */
    setIsLoggedIn(!!token);
  };

  const fetchCartItems = async () => {

    /* Captures the start time for the fetch operation. */
    const startTime = Date.now();
    try {
      const token = localStorage.getItem('access_token');

      /* Checks if the token exists, logs an error and returns if not. */
      if (!token) {
        console.error('No access token found');
        return;
      }

      /* Makes an API call to fetch cart items using the token for authorization. */
      const response = await axios.get('/cart/items', {
        headers: { Authorization: `Bearer ${token}` },
      });

      /* Updates cartItems state with the fetched data. */
      setCartItems(response.data);

      /* Logs and shows an error message if the fetch fails. */
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error('Failed to fetch cart items. Please try again.');
    }
    const endTime = Date.now();

    /* Logs the time taken to fetch cart items. */
    console.log(`Fetching cart items took ${endTime - startTime}ms`);
  };

  const updateCartItem = async (itemId, quantity) => {
    try {

      
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Please log in to update your cart.');
        return;
      }
      /* Makes an API call to update the cart item quantity. */
      await axios.put(
        '/cart/update',
        { itemId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      /* Refreshes the cart items after update. */
      fetchCartItems();

      /* Shows a success notification. */
      toast.success('Cart updated successfully');
    } catch (error) {

      /* Shows an error message. */
      console.error('Error updating cart item:', error);
      toast.error('Failed to update cart. Please try again.');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const token = localStorage.getItem('access_token');

      /* Ensures that a user is logged in. */
      if (!token) {
        toast.error('Please log in to remove items from your cart.');
        return;
      }

      /* Makes an API call to remove a cart item. */
      await axios.delete(`/cart/remove/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      /* Refreshes the cart items after removal. */
      fetchCartItems();

      /* Shows a success notification. */
      toast.success('Item removed from cart');
    } catch (error) {

      /* Shows an error message. */
      console.error('Error removing cart item:', error);
      toast.error('Failed to remove item. Please try again.');
    }
  };

  const goToCheckout = () => {

    /* Checks if the user is logged in, shows an error if not. */
    if (!isLoggedIn) {
      toast.error('Please log in to proceed to checkout.');
      return;
    }

    /* Checks if the cart is empty. */
    if (cartItems.length === 0) {
      toast.info('Your cart is empty.');
      return;
    }

    /* Navigates to the Checkout page. */
    navigate('/checkout');
  };

  const handleMealPlanningClick = () => {

    /* Navigates to the Meal Planning page. */
    navigate('/mealplanning');
  };

  /* Calculates the total price of the items in the cart. */
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

            {/* Conditional rendering to display cart items or an empty message. */}
            {cartItems.length > 0 ? (
              cartItems.map((item) => (

                /* Renders each cart item using the CartItem component. */
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

            {/* Button to proceed to checkout, calls goToCheckout on click. */}
            <button type="button" className="cart-button-checkout" onClick={goToCheckout}>
              Proceed to Checkout
            </button>

            {/* Button to navigate to meal planning, calls handleMealPlanningClick on click. */}
            <button type="button" className="cart-button-meal" onClick={handleMealPlanningClick}>
              Meal Planning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Makes the Cart component available for use in other parts of the website. */
export default Cart;
