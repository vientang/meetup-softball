import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Link } from 'gatsby';
import IconGroup from './IconGroup';
import Logo from './Logo';
import componentStyles from './components.module.css';

/**
 * Singleton component to ensure one instance
 */
const Header = () => ({ siteTitle, uri }) => {
    const headerClass = cn({
        [componentStyles.header]: true,
        [componentStyles.headerThemed]: uri !== '/',
    });

    const navLinkClass = cn({
        [componentStyles.navLink]: true,
        [componentStyles.navLinkThemed]: uri !== '/',
    });

    return (
        <>
            <header className={headerClass}>
                <Logo siteTitle={siteTitle} uri={uri} />

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
                    uri={uri}
                />
                <div className={componentStyles.navLinks}>
                    <Link to="/stats" className={navLinkClass}>
                        Stats
                    </Link>
                    <Link to="/leaderboard" className={navLinkClass}>
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
