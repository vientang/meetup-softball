import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import componentStyles from './components.module.css';

const Logo = ({ siteTitle }) => (
    <div>
        <Link to="/" className={componentStyles.siteTitle}>
            <p className={componentStyles.subHeader}>San Francisco</p>
            <h1 className={componentStyles.headerTitle}>{siteTitle}</h1>
        </Link>
    </div>
);

Logo.propTypes = {
    siteTitle: PropTypes.string,
};

export default Logo;
