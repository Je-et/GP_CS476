import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import LogoWhite from './assets/LogoWhite.png';

function Login({ setIsEmployee }) { // Receive setIsEmployee as a prop
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const validate = () => {
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

  const handleLogin = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      setLoginError('Please fix the errors above and try again.');
    } else {
      setErrors({});
      setLoginError('');
      
      try {
        const response = await axios.post('http://localhost:5000/auth/login', {
          username,
          password
        });

        if (response.data.access_token) {
          localStorage.setItem('access_token', response.data.access_token);
          localStorage.setItem('refresh_token', response.data.refresh_token);

          if (username.endsWith('.emp')) {
            setIsEmployee(true); // Set user role as employee
            navigate('/empdashboard');
          } else {
            setIsEmployee(false); // Set user role as shopper
            navigate('/');
          }
        } else {
          setLoginError('Invalid username or password. Please try again.');
        }
      } catch (error) {
        setLoginError('An error occurred during login. Please try again.');
      }
    }
  };

  return (
    <div>
      <div className="background-middle-login">
        <div className="login-container">
          <div className="login-form">
            <div className="logo">
              <Link to='/'>
                <img src={LogoWhite} alt="Logo" className="login-logo-image" />
              </Link>
            </div>
            <header className="login-header">Sign in to your account</header>
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
              {loginError && <span className="error-message">{loginError}</span>}

              <p className="login-p">Don't have an account yet? Click <Link to="/signup">here</Link> to sign up!</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
