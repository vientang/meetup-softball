import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Icon } from 'antd';
import styles from './filters.module.css';

const ResetFilters = ({ disabled, onClick }) => {
    const resetContainerClass = cn({
        [styles.filterResetContainer]: true,
        [styles.filterDisabled]: disabled,
    });
    const resetLabelClass = cn({
        [styles.filterReset]: true,
        [styles.filterLabelDisabled]: disabled,
    });
    return (
        <div className={resetContainerClass}>
            <span className={resetLabelClass} onClick={onClick}>
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
