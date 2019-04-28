import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import SocialIconGroup from './SocialIconGroup';
import Logo from './Logo';
import componentStyles from './components.module.css';

/**
 * Singleton component to ensure one instance
 */
const Header = () => ({ siteTitle, uri }) => {
    const headerStyle = {
        backgroundColor: uri === '/' ? 'transparent' : '#ffffff',
        borderBottom: uri === '/' ? 'none' : '1px solid #d1d1d1',
    };
    return (
        <>
            <header className={componentStyles.header} style={headerStyle}>
                <Logo siteTitle={siteTitle} uri={uri} />

                <SocialIconGroup
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
                    uri={uri}
                />
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
