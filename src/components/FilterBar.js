import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Dropdown, Menu, Icon } from 'antd';
import componentStyles from './components.module.css';

const menuItemStyle = {
    fontSize: 10,
    paddingTop: 0,
    paddingBottom: 0,
};

/* eslint-disable react/prop-types */
const ResetFilters = ({ onClick }) => (
    <div className={componentStyles.filterBarLabelResetContainer}>
        <span className={componentStyles.filterBarLabelReset} onClick={onClick}>
            <Icon type="filter" />
            reset filters
        </span>
    </div>
);

const createMenu = (menus, onFilterChange) => {
    const allStats = 'all';
    return (
        <Menu onClick={onFilterChange}>
            <Menu.Item style={menuItemStyle} key={allStats}>
                <span className={componentStyles.filterMenuAllLabel}>{allStats}</span>
            </Menu.Item>
            <Menu.Divider />
            {menus.map((menuItem) => {
                return (
                    <Menu.Item key={menuItem} className={componentStyles.filterMenuItem}>
                        <span className={componentStyles.filterMenuItemLabel}>{menuItem}</span>
                    </Menu.Item>
                );
            })}
        </Menu>
    );
};

const renderFilterTypes = (props) => {
    const {
        activeFilters,
        battingPositions,
        filterTypes,
        fields,
        months,
        onFilterChange,
        onMouseEnter,
        years,
    } = props;

    const menus = [years, months, fields, battingPositions];

    return (
        <div className={componentStyles.filterTypesGroup}>
            {filterTypes.map((filter, i) => {
                const filterName = activeFilters[filter] || filter;
                const filterBarClass = cn({
                    [componentStyles.filterBarLabelActive]: activeFilters[filter],
                    [componentStyles.filterBarLabelTypes]: !activeFilters[filter],
                });

                return (
                    <div key={filter} className={componentStyles.filterType}>
                        <Dropdown overlay={createMenu(menus[i], onFilterChange)}>
                            <span
                                className={filterBarClass}
                                onMouseEnter={onMouseEnter}
                                id={filter}
                            >
                                <span className={componentStyles.filterBarLabelName} id={filter}>
                                    {filterName.toUpperCase()}
                                </span>
                                <Icon type="down" />
                            </span>
                        </Dropdown>
                    </div>
                );
            })}
        </div>
    );
};

const FilterBar = (props) => {
    const { onResetFilters } = props;
    return (
        <>
            <div className={componentStyles.filterRow}>
                <div className={componentStyles.filterRowSection}>
                    {renderFilterTypes(props)}
                    <ResetFilters onClick={onResetFilters} />
                </div>
                <div className={componentStyles.searchBar}>
                    <input type="text" />
                </div>
            </div>
        </>
    );
};

FilterBar.displayName = 'FilterBar';
/* eslint-disable react/no-unused-prop-types */
FilterBar.propTypes = {
    activeFilters: PropTypes.shape(),
    filterTypes: PropTypes.arrayOf(PropTypes.string),
    years: PropTypes.arrayOf(PropTypes.string),
    months: PropTypes.arrayOf(PropTypes.string),
    fields: PropTypes.arrayOf(PropTypes.string),
    battingPositions: PropTypes.arrayOf(PropTypes.number),
    onFilterChange: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onResetFilters: PropTypes.func,
};

FilterBar.defaultProps = {
    filterTypes: ['2019', 'MONTHS', 'FIELDS', 'BATTING'],
    years: ['2019', '2018', '2017', '2016', '2015', '2014'],
    months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ],
    fields: ['West Sunset', 'Parkside', 'Westlake'],
    battingPositions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

export default FilterBar;
