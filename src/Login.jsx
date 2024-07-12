import React from 'react';
import './Login.css';


const Login = () => {
  return (
    <div>
        <header>
          <p>THIS IS THE HEADER</p>
        </header>

        <div class="background-middle-login">
          <div class="container">
            <div class="login-form">
                <h2>Sign in to your account</h2>
                  <form action="#" method="POST">
                      <input type="text" id="username" name="username" placeholder="Username"></input>
                      <input type="password" id="password" name="password" placeholder="Password"></input>
              
                      <div class="options">
                        <input type="checkbox" id="remember" name="remember"></input>
                        <label for="remember">Remember me</label>
                        <a href="#">Forgot Password?</a>
                      </div>

                        <button type="submit">SIGN IN</button>

                        <p>Don't have an account yet? Click <a href="#" id="register">here</a> to register!</p>

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

export default Login;
