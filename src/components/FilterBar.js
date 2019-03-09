import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Row, Col, Dropdown, Menu, Icon } from 'antd';
import componentStyles from './components.module.css';

const menuItemStyle = {
    paddingTop: 0,
    paddingBottom: 0,
};

/* eslint-disable react/prop-types */
const ResetFilters = ({ onClick }) => (
    <Col span={3}>
        <span className={componentStyles.filterBarLabelReset} onClick={onClick}>
            <Icon type="filter" />
            reset filters
        </span>
    </Col>
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
                    <Menu.Item key={menuItem}>
                        <span>{menuItem}</span>
                    </Menu.Item>
                );
            })}
        </Menu>
    );
};

const renderFilterType = (props) => {
    const {
        activeFilters,
        battingPositions,
        filterTypes,
        fields,
        months,
        onFilterChange,
        onMouseEnter,
        tournaments,
        years,
    } = props;

    const menus = [years, months, fields, tournaments, battingPositions];

    return filterTypes.map((filter, i) => {
        const filterName = activeFilters[filter] || filter;
        const filterBarClass = cn({
            [componentStyles.filterBarLabel]: activeFilters[filter],
            [componentStyles.filterBarLabelTypes]: !activeFilters[filter],
        });

        return (
            <Col key={filter} span={4}>
                <Dropdown overlay={createMenu(menus[i], onFilterChange)}>
                    <span className={filterBarClass} onMouseEnter={onMouseEnter} id={filter}>
                        <span className={componentStyles.filterBarLabelName} id={filter}>
                            {filterName.toUpperCase()}
                        </span>
                        <Icon type="down" />
                    </span>
                </Dropdown>
            </Col>
        );
    });
};

const FilterBar = (props) => {
    return (
        <Row gutter={16}>
            {renderFilterType(props)}
            <ResetFilters onClick={props.onResetFilters} />
        </Row>
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
    tournaments: PropTypes.arrayOf(PropTypes.string),
    battingPositions: PropTypes.arrayOf(PropTypes.number),
    onFilterChange: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onResetFilters: PropTypes.func,
};

FilterBar.defaultProps = {
    filterTypes: ['2019', 'MONTHS', 'FIELDS', 'BATTING', 'TOURNAMENTS'],
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
    tournaments: ['MLK'],
    battingPositions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

export default FilterBar;
