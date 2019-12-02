import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Dropdown, Icon } from 'antd';
import FilterMenu from './FilterMenu';
import styles from './filters.module.css';

const battingPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const FilterTypes = (props) => {
    const {
        filters = {},
        disabled,
        menu: { fields, months, years },
        onFilterChange,
        onMouseEnter,
    } = props;
    const menus = [years, months, fields, battingPositions];
    const filterTypeClass = cn({
        [styles.filterType]: true,
        [styles.filterDisabled]: disabled,
    });
    return (
        <div className={styles.filterTypesGroup}>
            {Object.keys(filters).map((filter, i) => {
                const filterLabelClass = cn({
                    [styles.filterLabels]: true,
                    [styles.filterLabelActive]: filters[filter] && !disabled,
                    [styles.filterLabelDisabled]: disabled,
                });
                return (
                    <div key={filter} className={filterTypeClass}>
                        <Dropdown
                            overlay={
                                <FilterMenu
                                    menus={menus[i]}
                                    onFilterChange={onFilterChange}
                                    filter={filter}
                                />
                            }
                        >
                            <span
                                className={filterLabelClass}
                                onMouseEnter={onMouseEnter}
                                id={filter}
                            >
                                <span className={styles.filterLabel} id={filter}>
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
};

FilterTypes.displayName = 'FilterTypes';
FilterTypes.propTypes = {
    filters: PropTypes.shape(),
    disabled: PropTypes.bool,
    onFilterChange: PropTypes.func,
    onMouseEnter: PropTypes.func,
    menu: PropTypes.shape(),
};

FilterTypes.defaultProps = {
    disabled: false,
    menu: {},
};

export default FilterTypes;
