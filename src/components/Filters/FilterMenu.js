import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';
import styles from './filters.module.css';

const FilterMenu = ({ menus, onFilterChange }) => {
    // TODO: add all summarized stats
    return (
        <Menu onClick={onFilterChange} className={styles.filterMenu}>
            <Menu.Divider />
            {menus.map((menuItem) => {
                const label = Array.isArray(menuItem) ? menuItem[0] : menuItem;
                const key = Array.isArray(menuItem) ? menuItem[1] : menuItem;
                return (
                    <Menu.Item key={key} className={styles.filterMenuItem}>
                        <span className={styles.filterMenuItemLabel}>{label}</span>
                    </Menu.Item>
                );
            })}
        </Menu>
    );
};

FilterMenu.displayName = 'FilterMenu';
FilterMenu.propTypes = {
    onFilterChange: PropTypes.func,
    menus: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    ),
};
FilterMenu.defaultProps = {
    menus: [],
};

export default FilterMenu;
