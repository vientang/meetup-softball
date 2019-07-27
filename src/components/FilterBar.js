import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Dropdown, Menu, Icon } from 'antd';
import SearchBar from './SearchBar';
import componentStyles from './components.module.css';

const menuItemStyle = {
    fontSize: 10,
    paddingTop: 0,
    paddingBottom: 0,
};

const FilterBar = (props) => {
    const { disabled, onResetFilters } = props;

    return (
        <div className={componentStyles.filterRow}>
            <div className={componentStyles.filterRowSection}>
                <FilterTypes {...props} />
                <ResetFilters onClick={onResetFilters} disabled={disabled} />
            </div>
            <SearchBar />
        </div>
    );
};

/* eslint-disable react/prop-types */
function FilterTypes(props) {
    const {
        activeFilters = {},
        battingPositions,
        disabled,
        filterTypes,
        fields,
        months,
        onFilterChange,
        onMouseEnter,
        years,
    } = props;

    const menus = [years, months, fields, battingPositions];

    const filterTypeClass = cn({
        [componentStyles.filterType]: true,
        [componentStyles.filterDisabled]: disabled,
    });

    return (
        <div className={componentStyles.filterTypesGroup}>
            {filterTypes.map((filter, i) => {
                const filterName = activeFilters[filter] || filter;
                const filterLabelClass = cn({
                    [componentStyles.filterLabels]: !activeFilters[filter],
                    [componentStyles.filterLabelActive]: activeFilters[filter],
                    [componentStyles.filterLabelDisabled]: disabled,
                });

                return (
                    <div key={filter} className={filterTypeClass}>
                        <Dropdown overlay={createMenu(menus[i], onFilterChange)}>
                            <span
                                className={filterLabelClass}
                                onMouseEnter={onMouseEnter}
                                id={filter}
                            >
                                <span className={componentStyles.filterLabel} id={filter}>
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
}

function ResetFilters({ disabled, onClick }) {
    const resetContainerClass = cn({
        [componentStyles.filterResetContainer]: true,
        [componentStyles.filterDisabled]: disabled,
    });

    const resetLabelClass = cn({
        [componentStyles.filterReset]: true,
        [componentStyles.filterLabelDisabled]: disabled,
    });
    
    return (
        <div className={resetContainerClass}>
            <span className={resetLabelClass} onClick={onClick}>
                <Icon type="filter" />
                reset filters
            </span>
        </div>
    );
}

function createMenu(menus, onFilterChange) {
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
}

FilterBar.displayName = 'FilterBar';
/* eslint-disable react/no-unused-prop-types */
FilterBar.propTypes = {
    activeFilters: PropTypes.shape(),
    battingPositions: PropTypes.arrayOf(PropTypes.number),
    disabled: PropTypes.bool,
    fields: PropTypes.arrayOf(PropTypes.string),
    filterTypes: PropTypes.arrayOf(PropTypes.string),
    months: PropTypes.arrayOf(PropTypes.string),
    onFilterChange: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onResetFilters: PropTypes.func,
    years: PropTypes.arrayOf(PropTypes.string),
};

FilterBar.defaultProps = {
    battingPositions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    disabled: false,
    fields: ['West Sunset', 'Parkside', 'Westlake'],
    filterTypes: ['2019', 'MONTHS', 'FIELDS', 'BATTING'],
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
    years: ['2019', '2018', '2017', '2016', '2015', '2014'],
};

export default FilterBar;
