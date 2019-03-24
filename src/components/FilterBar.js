import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Row, Col, Dropdown, Menu, Icon } from 'antd';
import componentStyles from './components.module.css';

const menuItemStyle = {
    paddingTop: 0,
    paddingBottom: 0,
};

const filterRowStyle = { display: 'flex', alignItems: 'center' };
/* eslint-disable react/prop-types */
const ResetFilters = ({ onClick }) => (
    <Col span={3}>
        <span className={componentStyles.filterBarLabelReset} onClick={onClick}>
            <Icon type="filter" />
            reset filters
        </span>
    </Col>
);

const GenderFilter = ({ gender, onGenderSelection }) => {
    const genderLabels = ['All', 'Men', 'Women'];

    return (
        <Row className={componentStyles.filterRow} style={filterRowStyle}>
            {genderLabels.map((genderLabel) => {
                const genderClass = cn({
                    [componentStyles.filterBarLabelGender]: true,
                    [componentStyles.filterBarLabelGenderActive]: genderLabel === gender,
                });
                return (
                    <Col key={genderLabel} span={1}>
                        <span id={genderLabel} onClick={onGenderSelection} className={genderClass}>
                            {genderLabel}
                        </span>
                    </Col>
                );
            })}
        </Row>
    );
};

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

/**
 * Dynamic column width based on length of filter string
 * @param {String} name
 */
const getColumnSpan = (name) => {
    const len = name.length;
    if (len < 5) {
        return 3;
    }
    if (len < 10) {
        return 4;
    }
    if (len < 15) {
        return 5;
    }
    return 6;
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
        const colSpan = getColumnSpan(activeFilters[filter]);

        return (
            <Col key={filter} span={colSpan}>
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
    const { gender, onGenderSelection, onResetFilters } = props;
    return (
        <>
            {gender && <GenderFilter gender={gender} onGenderSelection={onGenderSelection} />}
            <Row className={componentStyles.filterRow} gutter={16} style={filterRowStyle}>
                {renderFilterType(props)}
                <ResetFilters onClick={onResetFilters} />
            </Row>
        </>
    );
};

FilterBar.displayName = 'FilterBar';
/* eslint-disable react/no-unused-prop-types */
FilterBar.propTypes = {
    activeFilters: PropTypes.shape(),
    filterTypes: PropTypes.arrayOf(PropTypes.string),
    gender: PropTypes.string,
    years: PropTypes.arrayOf(PropTypes.string),
    months: PropTypes.arrayOf(PropTypes.string),
    fields: PropTypes.arrayOf(PropTypes.string),
    tournaments: PropTypes.arrayOf(PropTypes.string),
    battingPositions: PropTypes.arrayOf(PropTypes.number),
    onFilterChange: PropTypes.func,
    onGenderSelection: PropTypes.func,
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
