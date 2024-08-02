/* Essential for creating React components. */
import React, { useState } from 'react';

/* For routing and navigation. */
import { Link, useNavigate } from 'react-router-dom';

/* HTTP client for API requests. */
import axios from 'axios';

/* CSS styling for Login */
import './Login.css';

/* Logo image for the Login page. */
import LogoWhite from './assets/LogoWhite.png';

/* Defines the Login component and initializes state variables. Receive setIsEmployee as a prop. */
function Login({ setIsEmployee }) {

  /* Manage the state of input fields. */
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  /* Stores validation errors for form fields. */
  const [errors, setErrors] = useState({});

  /* Stores general login error messages. */
  const [loginError, setLoginError] = useState('');

  /* Used for navigation after successful login. */
  const navigate = useNavigate();

  /* Validates the login form fields. */
  const validate = () => {
    /* Collects error messages if validation fails. */
    const errors = {};

    if (!username) {
      errors.username = 'Username is required';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    return errors;
  };

  /* Handles form submission and user authentication. */
  const handleLogin = async (e) => {

    /* Prevents the default form submission. */
    e.preventDefault();

    /* Calls validate() to check for form errors. */
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      setLoginError('Please fix the errors above and try again.');
    } else {
      setErrors({});
      setLoginError('');
      
      try {

        /* Sends a POST request to the login endpoint with axios. */
        const response = await axios.post('http://localhost:5000/auth/login', {
          username,
          password
        });

        if (response.data.access_token) {

          /* Stores access_token and refresh_token in local storage upon successful login. */
          localStorage.setItem('access_token', response.data.access_token);
          localStorage.setItem('refresh_token', response.data.refresh_token);

          /* Set user role as employee */
          if (username.endsWith('.emp')) {
            setIsEmployee(true);

            /* Navigates to Employee Dashboard. */
            navigate('/empdashboard');

            /* Set user role as a shopper */
          } else {
            setIsEmployee(false);

            /* Navigates to the Home page. */
            navigate('/');
          }

          /* Displays appropriate error messages if login fails or an error occurs. */
        } else {
          setLoginError('Invalid username or password. Please try again.');
        }
      } catch (error) {
        setLoginError('An error occurred during login. Please try again.');
      }
    }
  };

  /* Renders the login form and associated UI elements. */
  return (
    <div>
      <div className="background-middle-login">
        <div className="login-container">
          <div className="login-form">
            <div className="logo">
              {/*Links to the home page. */}
              <Link to='/'>
                <img src={LogoWhite} alt="Logo" className="login-logo-image" />
              </Link>
            </div>
            <header className="login-header">Sign in to your account</header>

            {/* Includes input fields for username and password, a "Remember me" checkbox, and a submit button. */}
            <form className="Login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Username"
                  className={`login-input ${errors.username ? 'login-invalid-input' : ''}`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && <span className="error-message">{errors.username}</span>}
              </div>

              <div className="form-group">
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  className={`login-input ${errors.password ? 'login-invalid-input' : ''}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="login-options">
                <label htmlFor="remember" className="login-label">
                  <input type="checkbox" id="remember" name="remember" className="login-checkbox" />
                  Remember me
                </label>
              </div>

              <button type="submit" className="login-button">SIGN IN</button>

              {/* Displays validation and login errors. */}
              {loginError && <span className="error-message">{loginError}</span>}

              {/* Provides a link to the sign-up page if the user doesn't have an account. */}
              <p className="login-p">Don't have an account yet? Click <Link to="/signup">here</Link> to sign up!</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Exports the Login component so it can be used in other parts of the website. */
export default Login;
