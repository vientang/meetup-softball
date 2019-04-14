import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Link } from 'gatsby';
import componentStyles from './components.module.css';

const Logo = ({ siteTitle, uri }) => {
    const headerTitleClass = cn({
        [componentStyles.headerTitle]: true,
        [componentStyles.headerTitleThemed]: uri !== '/',
    });
    const subHeaderClass = cn({
        [componentStyles.subHeader]: true,
        [componentStyles.subHeaderThemed]: uri !== '/',
    });
    return (
        <div>
            <Link to="/" className={componentStyles.siteTitle}>
                <p className={subHeaderClass}>San Francisco</p>
                <h1 className={headerTitleClass}>{siteTitle}</h1>
            </Link>
        </div>
    );
};

Logo.propTypes = {
    siteTitle: PropTypes.string,
    uri: PropTypes.string,
};

export default Logo;
