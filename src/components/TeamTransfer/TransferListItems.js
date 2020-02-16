import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import AddPlayer from './AddPlayer';
import { PlayerAvatar } from '../Player';
import { findPlayerById } from '../../utils/helpers';
import styles from './transfer.module.css';

const listItemPhotoStyle = { height: 40, width: 40, margin: '0 0.5rem' };

const TransferListItems = ({
    allRsvpIds,
    listItems,
    listType,
    onAddPlayer,
    onRemovePlayer,
    onPlayerSelection,
    selected,
}) => (
    <div className={styles.teamTransferListItems}>
        {listItems.map((player) => {
            const { id, name, battingOrder, photos: { thumb_link } = {} } = player;

            const isSelected = findPlayerById(id, selected);
            let listItemSelected = null;
            let listItemNameSelected = null;

            if (isSelected) {
                listItemSelected = styles.teamTransferListItemSelected;
                listItemNameSelected = styles.teamTransferListItemNameSelected;
            }

            return (
                <div
                    key={id}
                    data-id={id}
                    className={`${styles.teamTransferListItem} ${listItemSelected}`}
                    onClick={onPlayerSelection}
                >
                    <span>
                        <Checkbox value={id} checked={!!isSelected} onChange={onPlayerSelection} />
                        <span className={styles.teamTransferListItemBattingOrder}>
                            {`${battingOrder}.`}
                        </span>
                        <PlayerAvatar src={thumb_link} style={listItemPhotoStyle} />
                        <span
                            className={`${styles.teamTransferListItemName} ${listItemNameSelected}`}
                        >
                            {name}
                        </span>
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
    listItems: PropTypes.arrayOf(PropTypes.shape),
    listType: PropTypes.string,
    onAddPlayer: PropTypes.func,
    onRemovePlayer: PropTypes.func,
    onPlayerSelection: PropTypes.func,
    selected: PropTypes.arrayOf(PropTypes.shape),
};
TransferListItems.defaultProps = {
    allRsvpIds: [],
    listItems: [],
    selected: [],
};
export default TransferListItems;
