import React from 'react';
import { Link } from 'react-router-dom';
import './Loginheader.css';
import Logo from './assets/Logo.png';

function Loginheader() {
  return (
    <header className="loginheader">
      <div className="logo">
        <Link to='/'>
          <img src={Logo} alt="Logo" className="header-logo-image" />
        </Link>
      </div>

    </header>
  );
}

export default Loginheader;
