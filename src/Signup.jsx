import React from 'react';
import './Signup.css';
import { Link } from 'react-router-dom';
import Loginheader from './Loginheader';

function Signup() {
  return (
    <div>
    <Loginheader/>
      <div className="background-middle-signin">
        <div className="signup-container">
          <div className="signup-form">
            <header className='signup-header'>Create an Account</header>
            <form action="#" method="POST">
              <input type="email" name="email" placeholder="Email Address" className='signup-input' />
              <input type="text" name="username" placeholder="Username" className='signup-input' />
              <input type="password" name="password" placeholder="Password" className='signup-input' />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" className='signup-input' />
              <button className="signup-button">GET STARTED</button>

              <p className='signup-p'>Already have an account? Click<a href="Login.jsx" id="register"> here</a>!</p>

            </form>
          </div>
        </div>
      </div>

      <footer>
        <p>© Green Basket 2024</p>
      </footer>
    </div>  
  );
};

export default Signup;
