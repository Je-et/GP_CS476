import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import chicken from './assets/chicken.jpg';
import steak from './assets/Steak.jpg';
import rice from './assets/Rice.jpg';
import salmon from './assets/Salmon.jpg';
import CartItem from './CartItem';
import Footer from './Footer';

const initialCartItems = [
  { id: 'item1', image: chicken, description: 'Whole Chicken', price: 6.99, quantity: 5 },
  { id: 'item2', image: steak, description: 'Steak', price: 9.99, quantity: 2 },
  { id: 'item3', image: rice, description: 'White Rice', price: 4.99, quantity: 3 },
  { id: 'item4', image: salmon, description: 'Salmon', price: 5.99, quantity: 6 },
];

function Cart() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const navigate = useNavigate();

  const increaseQuantity = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQuantity = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

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
            {cartItems.map(item => (
              <CartItem
                key={item.id}
                item={item}
                quantity={item.quantity}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
                removeItem={removeItem}
              />
            ))}
            
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