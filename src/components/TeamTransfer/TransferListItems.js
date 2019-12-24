import React from 'react';
import PropTypes from 'prop-types';
import AddPlayer from './AddPlayer';
import { PlayerAvatar } from '../Player';
import styles from './transfer.module.css';

const listItemPhotoStyle = { height: 40, width: 40, margin: '0 0.5rem' };

const TransferListItems = ({
    allRsvpIds,
    listItems,
    listType,
    onAddPlayer,
    onPlayerFocus,
    focusedItemId,
}) => (
    <div className={styles.teamTransferListItems}>
        {listItems.map((player) => {
            const { id, name, battingOrder, photos: { thumb_link } = {} } = player;
            const focusedStyle = id === focusedItemId ? styles.teamTransferListItemFocused : null;
            return (
                <div
                    key={id}
                    className={`${styles.teamTransferListItem} ${focusedStyle}`}
                    data-id={id}
                    onClick={onPlayerFocus}
                >
                    <span className={styles.teamTransferListItemName}>
                        <span className={styles.teamTransferListItemBattingOrder}>
                            {`${battingOrder}.`}
                        </span>
                        <PlayerAvatar src={thumb_link} style={listItemPhotoStyle} />
                        {name}
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
