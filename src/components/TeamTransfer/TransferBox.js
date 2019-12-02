import React from 'react';
import PropTypes from 'prop-types';
import TransferHeader from './TransferHeader';
import TransferListItems from './TransferListItems';
import TransferSortOperations from './TransferSortOperations';
import styles from './transfer.module.css';

const TransferBox = (props) => {
    const {
        allRsvpIds,
        listItems,
        listType,
        focusedItem,
        onAddPlayer,
        onPlayerFocus,
        onMoveDown,
        onMoveUp,
    } = props;

    const focusedItemId = focusedItem && focusedItem.id;

    return (
        <div className={styles.teamTransferList}>
            <TransferHeader listType={listType} playerCount={listItems.length} />
            <TransferListItems
                allRsvpIds={allRsvpIds}
                listItems={listItems}
                listType={listType}
                onAddPlayer={onAddPlayer}
                onPlayerFocus={onPlayerFocus}
                focusedItemId={focusedItemId}
            />
            <TransferSortOperations
                listType={listType}
                onMoveDown={onMoveDown}
                onMoveUp={onMoveUp}
            />
        </div>
    );
};

TransferBox.propTypes = {
    allRsvpIds: PropTypes.arrayOf(PropTypes.number),
    focusedItem: PropTypes.shape(),
    listItems: PropTypes.arrayOf(PropTypes.object),
    listType: PropTypes.string,
    onAddPlayer: PropTypes.func,
    onPlayerFocus: PropTypes.func,
    onMoveDown: PropTypes.func,
    onMoveUp: PropTypes.func,
};

TransferBox.defaultProps = {
    allRsvpIds: [],
    focusedItem: {},
    listItems: [],
};

export default TransferBox;
