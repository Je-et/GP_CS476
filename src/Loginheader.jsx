import React from 'react';
import { Link } from 'react-router-dom';
import './Loginheader.css';

function Loginheader() {
  return (
    <header className="loginheader">
      <div className="logo"><Link to='/' style={{ textDecoration: 'none' }}>Logo</Link></div>

    </header>
  );
}

export default Loginheader;
