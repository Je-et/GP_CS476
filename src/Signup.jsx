import React from 'react';
import './Signup.css';

const Signup = () => {
  return (
    <div>
      <header>
        <p>TELL ME MORE</p>
      </header>

      <div class="background-middle-signin">
        <div class="container">
          <div class="signup-form">
            <h2>Create an Account</h2>
            <form action="#" method="POST">
              <input type="email" name="email" placeholder="Email Address" />
              <input type="text" name="username" placeholder="Username" />
              <input type="password" name="password" placeholder="Password" />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" />
              <button type="submit">GET STARTED</button>

              <p>Already have an account? Click<a href="Login.jsx" id="register"> here</a>!</p>

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
