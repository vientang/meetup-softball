import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import styles from './filters.module.css';

const ResetFilters = ({ disabled, onClick }) => {
    if (disabled) {
        return null;
    }

    return (
        <div className={styles.filterResetContainer}>
            <span className={styles.filterReset} onClick={onClick}>
                <Icon type="filter" />
                reset filters
            </span>
        </div>
    );
};

ResetFilters.displayName = 'ResetFilters';
ResetFilters.propTypes = {
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
};
export default ResetFilters;
