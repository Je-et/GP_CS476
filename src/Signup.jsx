/* Essential for creating React components. */
import React, { useState } from 'react';

/* For routing and navigation. */
import { Link, useNavigate } from 'react-router-dom';

/* HTTP client for API requests. */
import axios from 'axios';

/* CSS styling for Signup component */
import './Signup.css';


function Signup() {
  /* Keeps track of the values entered in the form fields. */
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    profilePicture: null
  });
  /*  Stores validation error messages for each form field. Helps in displaying specific error messages based on user input. */
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  /* Manages updates to form fields and handles different input types */
  const handleChange = (e) => {
    const { name, type, value, files } = e.target;

    if (type === "file") {
      /* Handle file input separately */
      setFormData({
        ...formData,
        profilePicture: files[0]
      });
    } else {
      /* Applies character limit */
      if (value.length > 16 && name !== 'email') {
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

  /* Handles form submission by validating inputs, creating a 'formData' object, and sending the data to the backend. */
  const handleSubmit = async (e) => {
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

    /* Proceed with form submission if no errors */
    if (Object.keys(newErrors).length === 0) {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('username', formData.username);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('profilePicture', formData.profilePicture);

        const response = await axios.post('http://localhost:5000/auth/signup', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.message === "User created successfully") {
          /* Redirect to login page after successful signup */
          navigate('/login');
        } else {
          setErrors({ general: response.data.message });
        }
      } catch (error) {
        setErrors({ general: 'Something went wrong. Please try again.' });
      }
    }
  };

  /* Function to capitalize the first letter of a string */
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div>
      <div className="background-middle-signin">
        <div className="signup-container">
          <div className="signup-form">
            <header className='signup-header'>Create an Account</header>
            <form onSubmit={handleSubmit}>
              {/* Accepts email addresses. */}
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className={`signup-input ${errors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={handleChange}
              />
              {/* Displayed conditionally based on the errors state. */}
              {errors.email && <p className="signup-error-message">{errors.email}</p>}
              
              {/* Accepts usernames with a character limit. */ }
              <input
                type="text"
                name="username"
                placeholder="Username"
                className={`signup-input ${errors.username ? 'error' : ''}`}
                value={formData.username}
                onChange={handleChange}
              />
              {/* Displayed conditionally based on the errors state. */}
              {errors.username && <p className="signup-error-message">{errors.username}</p>}
              
              {/* Accepts passwords. */}
              <input
                type="password"
                name="password"
                placeholder="Password"
                className={`signup-input ${errors.password ? 'error' : ''}`}
                value={formData.password}
                onChange={handleChange}
              />
              {/* Displayed conditionally based on the errors state. */}
              {errors.password && <p className="signup-error-message">{errors.password}</p>}
              
              {/* Confirms the entered password. */}
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className={`signup-input ${errors.confirmPassword ? 'error' : ''}`}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {/* Displayed conditionally based on the errors state. */}
              {errors.confirmPassword && <p className="signup-error-message">{errors.confirmPassword}</p>}
              
              {/* Allows the user to upload a profile picture. */}
              <input
                type="file"
                name="profilePicture"
                className={`file-input ${errors.profilePicture ? 'error' : ''}`}
                onChange={handleChange}
              />
              {/* Displayed conditionally based on the errors state. */}
              {errors.profilePicture && <p className="signup-error-message">{errors.profilePicture}</p>}
              
              {/* Triggers form submission. */}
              <button type="submit" className="signup-button">GET STARTED</button>

              {/* Displayed conditionally based on the errors state. */}
              {errors.general && <p className="signup-error-message">{errors.general}</p>}

              {/* Provides navigation to the login page if the user already has an account. */}
              <p className='signup-p'>Already have an account? Click <Link to="/login">here</Link> to sign in!</p>
            </form>
          </div>
        </div>
      </div>
    </div>  
  );
}

/* Exports the Signup component so it can be used in other parts of the website. */
export default Signup;
