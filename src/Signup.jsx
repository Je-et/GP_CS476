import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';
import Loginheader from './Loginheader';

function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Apply character limit
    if (value.length > 16) {
      setErrors({
        ...errors,
        [name]: `${capitalizeFirstLetter(name)} must be 16 characters or less.`,
      });
    } else {
      setErrors({
        ...errors,
        [name]: '',
      });
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required!';
    }
    if (!formData.username) {
      newErrors.username = 'Username is required!';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required!';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password!';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match!';
    }
    setErrors(newErrors);

    // Proceed with form submission if no errors
    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData); 
    }
  };

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div>
      <Loginheader />
      <div className="background-middle-signin">
        <div className="signup-container">
          <div className="signup-form">
            <header className='signup-header'>Create an Account</header>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className={`signup-input ${errors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="signup-error-message">{errors.email}</p>}
              
              <input
                type="text"
                name="username"
                placeholder="Username"
                className={`signup-input ${errors.username ? 'error' : ''}`}
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && <p className="signup-error-message">{errors.username}</p>}
              
              <input
                type="password"
                name="password"
                placeholder="Password"
                className={`signup-input ${errors.password ? 'error' : ''}`}
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="signup-error-message">{errors.password}</p>}
              
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className={`signup-input ${errors.confirmPassword ? 'error' : ''}`}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <p className="signup-error-message">{errors.confirmPassword}</p>}
              
              <button type="submit" className="signup-button">GET STARTED</button>
              <p className='signup-p'>Already have an account? Click <Link to="/login">here</Link> to sign in!</p>
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

export default Signup;
