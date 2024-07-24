import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    profilePicture: null  // Added for storing the uploaded profile picture
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;

    if (type === "file") {
      // Handle file input separately
      setFormData({
        ...formData,
        profilePicture: files[0]
      });
    } else {
      // Apply character limit
      if (value.length > 16 && name !== 'email') {  // Email can exceed 16 characters
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
    if (!formData.profilePicture) {
      newErrors.profilePicture = 'Profile picture is required!';
    }
    setErrors(newErrors);

    // Proceed with form submission if no errors
    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData); 
      // Include logic to handle the form submission, like sending data to the server
    }
  };

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div>
      <div className="background-middle-signin">
        <div className="signup-container">
          <div className="signup-form">
            <header className='signup-header'>Start Your Green Journey Today!</header>
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
              
              <input
                type="file"
                name="profilePicture"
                className={`file-input ${errors.profilePicture ? 'error' : ''}`}
                onChange={handleChange}
              />
              {errors.profilePicture && <p className="signup-error-message">{errors.profilePicture}</p>}
              
              <button type="submit" className="signup-button">GET STARTED</button>
              <p className='signup-p'>Already have an account? Click <Link to="/login">here</Link> to login!</p>
            </form>
          </div>
        </div>
      </div>
    </div>  
  );
}

export default Signup;
