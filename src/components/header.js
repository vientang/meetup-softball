/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import SocialIconGroup from './SocialIconGroup';
import Logo from './Logo';
import NavLinks from './NavLinks';
import componentStyles from './components.module.css';

const Header = () => ({ siteTitle, uri }) => {
    const headerStyle = {
        backgroundColor: uri === '/' ? 'transparent' : '#ffffff',
        borderBottom: uri === '/' ? 'none' : '1px solid #d1d1d1',
    };

    if (uri === '/admin/') {
        return <Logo siteTitle={siteTitle} uri={uri} />;
    }

    return (
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
            <NavLinks />
        </header>
    );
};

Header.displayName = 'Header';
Header.propTypes = {
    siteTitle: PropTypes.string,
    uri: PropTypes.string,
};

export default Header();
