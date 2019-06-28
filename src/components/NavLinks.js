import React from 'react';
import { Link } from 'gatsby';
import componentStyles from './components.module.css';

const NavLinks = () => {
    return (
        <div className={componentStyles.navLinks}>
            <Link
                to="/stats"
                className={componentStyles.navLink}
                activeClassName={componentStyles.activeNavLink}
            >
                Stats
            </Link>
            <Link
                to="/leaderboard"
                className={componentStyles.navLink}
                activeClassName={componentStyles.activeNavLink}
            >
                Leaderboard
            </Link>
        </div>
    );
};

NavLinks.displayName = 'NavLinks';

export default NavLinks;
