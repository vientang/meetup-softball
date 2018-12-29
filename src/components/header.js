import React from 'react'
import { Link } from 'gatsby'
import componentStyles from './components.module.css';

const Header = () => ({ siteTitle }) => (
  <div className={componentStyles.headerContainer}>
        <div className={componentStyles.header}>
            <h1 className={componentStyles.headerH1}>
                <Link to="/" className={componentStyles.siteTitle}>
                    {siteTitle}
                </Link>
            </h1>
            <Link to="/admin" className={componentStyles.siteTitle}>
                Sign in
            </Link>
        </div>
  </div>
);

export default Header();
