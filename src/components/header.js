import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import IconGroup from './IconGroup';
import componentStyles from './components.module.css';

/**
 * Singleton component to ensure one instance
 */
const Header = () => ({ siteTitle, uri }) => {
    const headerStyle = {
        boxShadow: uri !== '/' ? '0 -25px 20px 14px #345160' : null,
    };
    return (
        <>
            <IconGroup
                types={[
                    {
                        type: 'facebook',
                        url: 'https://www.facebook.com/groups/SFsoftballmeetup/',
                    },
                    {
                        type: 'meetup',
                        url: 'https://www.meetup.com/San-Francisco-Softball-Players/',
                    },
                ]}
            />
            <header className={componentStyles.header} style={headerStyle}>
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
            </header>
        </>
    );
};

Header.displayName = 'Header';
Header.propTypes = {
    siteTitle: PropTypes.string,
    uri: PropTypes.string,
};

export default Header();
