import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Icon } from 'antd';
import FilterBar from './FilterBar';
import SearchBar from './SearchBar';
import componentStyles from './components.module.css';

const ActionBar = ({ className, disabled, filterBarOptions, inactivePlayers, players, uri }) => {
    const [openActive, setOpenActive] = useState(false);
    const [openInactive, setOpenInactive] = useState(false);

    if (uri === '/') {
        return null;
    }

    const showDrawer = () => {
        setOpenActive(true);
    };
    const closeDrawer = () => {
        setOpenActive(false);
    };

    const showInactiveDrawer = () => {
        setOpenInactive(true);
    };
    const closeInactiveDrawer = () => {
        setOpenInactive(false);
    };

    return (
        <div className={`${componentStyles.filterRow} ${className}`}>
            <FilterBar {...filterBarOptions} disabled={disabled} />
            <div className={componentStyles.searchIcon} onClick={showDrawer}>
                <Icon type="search" />
            </div>
            <Drawer title="ACTIVE PLAYERS" width={400} onClose={closeDrawer} visible={openActive}>
                <SearchBar
                    disabled={disabled}
                    players={players}
                    showInactiveDrawer={showInactiveDrawer}
                />
                <Drawer
                    title="Inactive players"
                    width={300}
                    onClose={closeInactiveDrawer}
                    visible={openInactive}
                >
                    <SearchBar
                        disabled={disabled}
                        players={inactivePlayers}
                        showInactiveDrawer={showInactiveDrawer}
                    />
                </Drawer>
            </Drawer>
        </div>
    );
};

ActionBar.displayName = 'ActionBar';
ActionBar.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    filterBarOptions: PropTypes.shape(),
    players: PropTypes.arrayOf(PropTypes.shape),
    uri: PropTypes.string,
};
ActionBar.defaultProps = {
    filterBarOptions: {},
    players: [],
};

export default ActionBar;
