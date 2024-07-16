import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import Loginheader from './Loginheader';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required!';
    if (!password) newErrors.password = 'Password is required!';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Apply character limit
    if (value.length > 16) {
      setErrors({
        ...errors,
        [name]: `${capitalizeFirstLetter(name)} must be 16 characters or less.`,
      });

      // Truncate the value to 16 characters
      if (name === 'username') {
        setUsername(value.slice(0, 16));
      } else if (name === 'password') {
        setPassword(value.slice(0, 16));
      }
    } else {
      setErrors({
        ...errors,
        [name]: '',
      });

      // Update state with new value
      if (name === 'username') {
        setUsername(value);
      } else if (name === 'password') {
        setPassword(value);
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      if (username === 'user' && password === 'pass') {
        alert('Login successful!');
      } else {
        setLoginError('Invalid username or password!');
      }
    }
  };

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };


  return (
    <div>
      <Loginheader />
      <div className="background-middle-login">
        <div className="login-container">
          <div className="login-form">
            <header className="login-header">Sign in to your account</header>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Username"
                  className={`login-input ${errors.username ? 'error' : ''}`}
                  value={username}
                  onChange={handleChange}
                />
                {errors.username && <span className="login-error-message">{errors.username}</span>}
              </div>

              <div className="form-group">
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  className={`login-input ${errors.password ? 'error' : ''}`}
                  value={password}
                  onChange={handleChange}
                />
                {errors.password && <span className="login-error-message">{errors.password}</span>}
              </div>

              <div className="login-options">
                <label htmlFor="remember" className="login-label">
                  <input type="checkbox" id="remember" name="remember" className="login-checkbox" />
                  Remember me
                </label>
                <a href="#" className="forgot-password-link">Forgot Password?</a>
              </div>

              <button type="submit" className="login-button">SIGN IN</button>
              {loginError && <span className="error-message">{loginError}</span>}

              <p className="login-p">Don't have an account yet? Click <Link to="/signup">here</Link> to sign up!</p>
            </form>
          </div>
        </div>
      </div>
      <footer>
        <p>© Green Basket 2024</p>
      </footer>
    </div>
  );
}

export default Login;
