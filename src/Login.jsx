import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import LogoWhite from './assets/LogoWhite.png';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const validate = () => {
    const errors = {};

    // Validate username
    if (!username) {
      errors.username = 'Username is required';
    }

    // Validate password
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    return errors;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      setLoginError('Please fix the errors above and try again.');
    } else {
      setErrors({});
      setLoginError('');
      // Implement login logic here
      alert('Login successful!');
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
            <form onSubmit={handleLogin}>
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