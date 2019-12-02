import React from 'react';
import PropTypes from 'prop-types';
import FilterTypes from './FilterTypes';
import ResetFilters from './ResetFilters';
import styles from './filters.module.css';

const FilterBar = (props) => {
    const { disabled, onResetFilters } = props;

    return (
        <div className={styles.filterRowSection}>
            <FilterTypes {...props} />
            <ResetFilters onClick={onResetFilters} disabled={disabled} />
        </div>
    );
};

FilterBar.displayName = 'FilterBar';
FilterBar.propTypes = {
    filters: PropTypes.shape(),
    disabled: PropTypes.bool,
    onFilterChange: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onResetFilters: PropTypes.func,
    menu: PropTypes.shape(),
};

FilterBar.defaultProps = {
    disabled: false,
    menu: {},
};

export default FilterBar;
