import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Link } from 'gatsby';
import componentStyles from './components.module.css';

const Logo = ({ siteTitle, uri }) => {
    const subHeaderClass = cn({
        [componentStyles.subHeader]: true,
        [componentStyles.subHeaderThemed]: uri !== '/',
    });
    return (
        <div>
            <h1 className={componentStyles.headerH1}>
                <Link to="/" className={componentStyles.siteTitle}>
                    <p className={subHeaderClass}>San Francisco</p>
                    {siteTitle}
                </Link>
            </h1>
        </div>
    );
};

Logo.propTypes = {
    siteTitle: PropTypes.string,
    uri: PropTypes.string,
};

export default Logo;
