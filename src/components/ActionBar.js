import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Icon } from 'antd';
import FilterBar from './Filters';
import SearchBar from './SearchBar';
import componentStyles from './components.module.css';

const ActionBar = ({ className, disabled, filterBarOptions, inactivePlayers, players, uri }) => {
    const [openActive, setOpenActive] = useState(false);
    const [renderChildren, setRenderChildren] = useState(false);
    const [openInactive, setOpenInactive] = useState(false);

    if (uri === '/') {
        return null;
    }

    const showDrawer = () => {
        setOpenActive(true);
    };
    const closeDrawer = () => {
        setOpenActive(false);
        setRenderChildren(false);
    };

    const showInactiveDrawer = () => {
        setOpenInactive(true);
    };
    const closeInactiveDrawer = () => {
        setOpenInactive(false);
    };

    const handleAfterVisibleChange = () => {
        if (openActive) {
            setRenderChildren(true);
        }
    };

    return (
        <div className={`${componentStyles.actionBar} ${className}`}>
            <FilterBar {...filterBarOptions} disabled={disabled} />
            <div className={componentStyles.searchIcon} onClick={showDrawer}>
                <Icon type="search" />
            </div>
            <Drawer
                afterVisibleChange={handleAfterVisibleChange}
                title="ACTIVE PLAYERS"
                width={400}
                onClose={closeDrawer}
                visible={openActive}
                destroyOnClose
            >
                {renderChildren && (
                    <>
                        <SearchBar
                            players={players}
                            showInactiveDrawer={showInactiveDrawer}
                            open={openActive}
                        />
                        <Drawer
                            title="Inactive players"
                            width={300}
                            onClose={closeInactiveDrawer}
                            visible={openInactive}
                        >
                            <SearchBar
                                players={inactivePlayers}
                                showInactiveDrawer={showInactiveDrawer}
                                open={openActive}
                            />
                        </Drawer>
                    </>
                )}
            </Drawer>
        </div>
    );
};

ActionBar.displayName = 'ActionBar';
ActionBar.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    filterBarOptions: PropTypes.shape(),
    inactivePlayers: PropTypes.arrayOf(PropTypes.shape),
    players: PropTypes.arrayOf(PropTypes.shape),
    uri: PropTypes.string,
};
ActionBar.defaultProps = {
    filterBarOptions: {},
    inactivePlayers: [],
    players: [],
};

export default ActionBar;
