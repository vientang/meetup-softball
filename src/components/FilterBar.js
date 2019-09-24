import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Dropdown, Menu, Icon } from 'antd';
import SearchBar from './SearchBar';
import componentStyles from './components.module.css';

const years = ['2019', '2018', '2017', '2016', '2015', '2014', '2013'];
const months = [
    ['January', '01'],
    ['February', '02'],
    ['March', '03'],
    ['April', '04'],
    ['May', '05'],
    ['June', '06'],
    ['July', '07'],
    ['August', '08'],
    ['September', '09'],
    ['October', '10'],
    ['November', '11'],
    ['December', '12'],
];
const fields = ['West Sunset', 'Parkside', 'Westlake'];
const battingPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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
            <SearchBar disabled={disabled} />
        </div>
    );
};

/* eslint-disable react/prop-types */
function FilterTypes(props) {
    const { filters = {}, disabled, onFilterChange, onMouseEnter } = props;

    const menus = [years, months, fields, battingPositions];

    const filterTypeClass = cn({
        [componentStyles.filterType]: true,
        [componentStyles.filterDisabled]: disabled,
    });

    return (
        <div className={componentStyles.filterTypesGroup}>
            {Object.keys(filters).map((filter, i) => {
                const filterLabelClass = cn({
                    [componentStyles.filterLabels]: true,
                    [componentStyles.filterLabelActive]: filters[filter] && !disabled,
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
                                    {filters[filter] || filter.toUpperCase()}
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
                const label = Array.isArray(menuItem) ? menuItem[0] : menuItem;
                const key = Array.isArray(menuItem) ? menuItem[1] : menuItem;
                return (
                    <Menu.Item key={key} className={componentStyles.filterMenuItem}>
                        <span className={componentStyles.filterMenuItemLabel}>{label}</span>
                    </Menu.Item>
                );
            })}
        </Menu>
    );
}

FilterBar.displayName = 'FilterBar';
/* eslint-disable react/no-unused-prop-types */
FilterBar.propTypes = {
    filters: PropTypes.shape(),
    disabled: PropTypes.bool,
    onFilterChange: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onResetFilters: PropTypes.func,
};

FilterBar.defaultProps = {
    disabled: false,
};

export default FilterBar;
