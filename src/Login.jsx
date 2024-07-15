import React from 'react';
import './Login.css';
import Loginheader from './Loginheader';




function Login() {
  return (
    <div>
      <Loginheader/>
        <div className="background-middle-login">
          <div className="login-container">
            <div className="login-form">
                <header className="login-header">Sign in to your account</header>
                  <form action="#" method="POST">
                      <input type="text" id="username" name="username" placeholder="Username" className='login-input'></input>
                      <input type="password" id="password" name="password" placeholder="Password" className='login-input'></input>
              
                      <div className="login-options">
                        <input type="checkbox" className="login-input" id="remember" name="remember"></input>
                        <label for="remember">Remember me</label>
                        <a href="#">Forgot Password?</a>
                      </div>

                        <button className="login-button">SIGN IN</button>

                        <p className='login-p'>Don't have an account yet? Click <a href="#" id="register">here</a> to register!</p>

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
