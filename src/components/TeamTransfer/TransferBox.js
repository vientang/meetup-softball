import React from 'react';
import PropTypes from 'prop-types';
import TransferHeader from './TransferHeader';
import TransferListItems from './TransferListItems';
import TransferSortOperations from './TransferSortOperations';
import styles from './transfer.module.css';

const TransferBox = (props) => {
    const {
        listItems,
        onAddPlayer,
        onRemovePlayer,
        onPlayerSelection,
        onMoveDown,
        onMoveUp,
        selected,
        team,
    } = props;

    const handlePlayerSelection = (e) => {
        onPlayerSelection(e, team);
    };

    return (
        <div className={styles.teamTransferList}>
            <TransferHeader team={team} playerCount={listItems.length} />
            <TransferListItems
                listItems={listItems}
                team={team}
                onAddPlayer={onAddPlayer}
                onRemovePlayer={onRemovePlayer}
                onPlayerSelection={handlePlayerSelection}
                selected={selected}
            />
            <TransferSortOperations onMoveDown={onMoveDown} onMoveUp={onMoveUp} team={team} />
        </div>
    );
};

TransferBox.propTypes = {
    listItems: PropTypes.arrayOf(PropTypes.object),
    onAddPlayer: PropTypes.func,
    onRemovePlayer: PropTypes.func,
    onPlayerSelection: PropTypes.func,
    onMoveDown: PropTypes.func,
    onMoveUp: PropTypes.func,
    selected: PropTypes.arrayOf(PropTypes.object),
    team: PropTypes.string,
};

TransferBox.defaultProps = {
    selected: [],
    listItems: [],
};

export default TransferBox;
