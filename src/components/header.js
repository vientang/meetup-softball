import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import componentStyles from './components.module.css';

const Header = () => ({ siteTitle }) => (
    <header className={componentStyles.headerContainer}>
        <div className={componentStyles.header}>
            <h1 className={componentStyles.headerH1}>
                <p className={componentStyles.subHeader}>San Francisco</p>
                <Link to="/" className={componentStyles.siteTitle}>
                    {siteTitle}
                </Link>
            </h1>
            <div className={componentStyles.navLinks}>
                <Link to="/stats" className={componentStyles.navLink}>
                    Stats
                </Link>
                <Link to="/leaderboard" className={componentStyles.navLink}>
                    Leaderboard
                </Link>
            </div>
        </div>
    </header>
);

Header.displayName = 'Header';
Header.propTypes = {
    siteTitle: PropTypes.string,
};

export default Header();
