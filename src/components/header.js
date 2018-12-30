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
            <Link to="/stats" className={componentStyles.siteTitle}>
                Stats
            </Link>
            <Link to="/admin" className={componentStyles.siteTitle}>
                Admin
            </Link>
        </div>
  </div>
);

export default Header();
