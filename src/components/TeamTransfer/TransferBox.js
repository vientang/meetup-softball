import React from 'react';
import PropTypes from 'prop-types';
import TransferHeader from './TransferHeader';
import TransferListItems from './TransferListItems';
import TransferSortOperations from './TransferSortOperations';
import styles from './transfer.module.css';

const TransferBox = (props) => {
    const {
        listItems,
        listType,
        onAddPlayer,
        onPlayerSelection,
        onMoveDown,
        onMoveUp,
        selected,
    } = props;

    return (
        <div className={styles.teamTransferList}>
            <TransferHeader listType={listType} playerCount={listItems.length} />
            <TransferListItems
                listItems={listItems}
                listType={listType}
                onAddPlayer={onAddPlayer}
                onPlayerSelection={onPlayerSelection}
                selected={selected}
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
    selected: PropTypes.arrayOf(PropTypes.object),
    listItems: PropTypes.arrayOf(PropTypes.object),
    listType: PropTypes.string,
    onAddPlayer: PropTypes.func,
    onPlayerSelection: PropTypes.func,
    onMoveDown: PropTypes.func,
    onMoveUp: PropTypes.func,
};

TransferBox.defaultProps = {
    selected: [],
    listItems: [],
};

export default TransferBox;
