import React from 'react';
import PropTypes from 'prop-types';
import AddPlayer from './AddPlayer';
import styles from './transfer.module.css';

const TransferListItems = (props) => {
    const { allRsvpIds, listItems, listType, onAddPlayer, onPlayerFocus, focusedItemId } = props;
    return (
        <div className={styles.teamTransferListItems}>
            {listItems.map((player) => {
                const focusedStyle =
                    player.id === focusedItemId ? styles.teamTransferListItemFocused : null;
                return (
                    <div
                        key={player.id}
                        className={`${styles.teamTransferListItem} ${focusedStyle}`}
                        data-id={player.id}
                        onClick={onPlayerFocus}
                    >
                        <span className={styles.teamTransferListItemName}>
                            {`${player.battingOrder}. ${player.name}`}
                        </span>
                    </div>
                );
            })}
            {listItems.length > 0 && (
                <AddPlayer
                    allRsvpIds={allRsvpIds}
                    listCount={listItems.length}
                    listType={listType}
                    onAddPlayer={onAddPlayer}
                />
            )}
        </div>
    );
};

TransferListItems.displayName = 'TransferListItems';
TransferListItems.propTypes = {
    allRsvpIds: PropTypes.arrayOf(PropTypes.number),
    focusedItemId: PropTypes.number,
    listItems: PropTypes.arrayOf(PropTypes.shape),
    listType: PropTypes.string,
    onAddPlayer: PropTypes.func,
    onPlayerFocus: PropTypes.func,
};
TransferListItems.defaultProps = {
    allRsvpIds: [],
    listItems: [],
};
export default TransferListItems;
