import React from 'react';
import PropTypes from 'prop-types';
import FilterBar from './FilterBar';
import SearchBar from './SearchBar';
import componentStyles from './components.module.css';

const ActionBar = ({ className, disabled, filterBarOptions, players, uri }) => {
    if (uri === '/') {
        return null;
    }
    return (
        <div className={`${componentStyles.filterRow} ${className}`}>
            <FilterBar {...filterBarOptions} disabled={disabled} />
            <SearchBar disabled={disabled} players={players} />
        </div>
    );
};

ActionBar.displayName = 'ActionBar';
ActionBar.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    filterBarOptions: PropTypes.shape(),
    players: PropTypes.arrayOf(PropTypes.shape),
    uri: PropTypes.string,
};
ActionBar.defaultProps = {
    filterBarOptions: {},
    players: [],
};

export default ActionBar;
