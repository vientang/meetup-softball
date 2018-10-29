import React from 'react'
import { Link } from 'gatsby'
import './components.css';

const Header = () => ({ siteTitle }) => (
  <div className="header-container">
    <div className="header">
      <h1 className="header-h1">
        <Link to="/" className="site-title">
          {siteTitle}
        </Link>
      </h1>
      <Link to="/admin" className="site-title">
        Sign in
      </Link>
    </div>
  </div>
);

export default Header();
