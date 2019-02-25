import React from 'react';
import PropTypes from 'prop-types';
import componentStyles from './components.module.css';

const ListItem = ({ children, focused, onClick, value }) => {
    const focusedStyle = focused ? componentStyles.teamTransferListItemFocused : null;

    return (
        <div
            className={`${componentStyles.teamTransferListItem} ${focusedStyle}`}
            data-id={value}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

ListItem.displayName = 'ListItem';
ListItem.propTypes = {
    children: PropTypes.element,
    focused: PropTypes.bool,
    onClick: PropTypes.func,
    value: PropTypes.string,
};

export default ListItem;
