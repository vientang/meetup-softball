import React from 'react';
import PropTypes from 'prop-types';
import AddPlayer from './AddPlayer';
import PlayerAvatar from '../PlayerAvatar';
import styles from './transfer.module.css';

const listItemPhotoStyle = { height: 40, width: 40, margin: '0 0.5rem' };

const TransferListItems = (props) => {
    const {
        allPlayers,
        allRsvpIds,
        listItems,
        listType,
        onAddPlayer,
        onPlayerFocus,
        focusedItemId,
    } = props;
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
                            <span className={styles.teamTransferListItemBattingOrder}>
                                {`${player.battingOrder}.`}
                            </span>
                            <PlayerAvatar
                                image={player.photos.thumb_link}
                                style={listItemPhotoStyle}
                            />
                            {player.name}
                        </span>
                    </div>
                );
            })}
            {listItems.length > 0 && (
                <AddPlayer
                    allPlayers={allPlayers}
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
    allPlayers: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            gp: PropTypes.number,
            photos: PropTypes.shape,
        }),
    ),
    allRsvpIds: PropTypes.arrayOf(PropTypes.number),
    focusedItemId: PropTypes.number,
    listItems: PropTypes.arrayOf(PropTypes.shape),
    listType: PropTypes.string,
    onAddPlayer: PropTypes.func,
    onPlayerFocus: PropTypes.func,
};
TransferListItems.defaultProps = {
    allPlayers: [],
    allRsvpIds: [],
    listItems: [],
};
export default TransferListItems;
