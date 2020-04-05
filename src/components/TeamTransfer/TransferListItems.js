import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Icon, Popconfirm } from 'antd';
import AddPlayer from './AddPlayer';
import { PlayerAvatar } from '../Player';
import { findPlayerById } from '../../utils/helpers';
import styles from './transfer.module.css';

const listItemPhotoStyle = { height: 40, width: 40, margin: '0 0.5rem' };

const TransferListItems = ({
    listItems,
    onAddPlayer,
    onRemovePlayer,
    onPlayerSelection,
    selected,
    team,
}) => {
    const [forRemoval, setForRemoval] = useState(null);
    const currentPlayers = listItems.map((player) => ({ id: player.id, name: player.name }));
    const handleRemovePlayer = (player) => () => {
        onRemovePlayer(player, team);
        setForRemoval(null);
    };

    const handleCancelRemovePlayer = () => {
        setForRemoval(null);
    };

    const handleSelectRemovePlayer = (e) => {
        setForRemoval(e.target.value);
    };

    const handleVisibleChange = () => {
        setForRemoval(null);
    };

    return (
        <div className={styles.teamTransferListItems}>
            {listItems.map((player) => {
                const { id, name, battingOrder, photos: { thumb_link } = {} } = player;

                const isSelected = findPlayerById(id, selected);
                let listItemSelected = '';
                let listItemNameSelected = '';

                if (isSelected) {
                    listItemSelected = styles.teamTransferListItemSelected;
                    listItemNameSelected = styles.teamTransferListItemNameSelected;
                }

                const prompt = `Are you sure you want to remove ${name}?`;
                return (
                    <div key={id} className={`${styles.teamTransferListItem} ${listItemSelected}`}>
                        <Popconfirm
                            title={prompt}
                            okText="Yes"
                            cancelText="No"
                            icon={
                                <Icon type="close-circle" style={{ color: 'red' }} theme="filled" />
                            }
                            onCancel={handleCancelRemovePlayer}
                            onConfirm={handleRemovePlayer(player)}
                            onVisibleChange={handleVisibleChange}
                        >
                            <Checkbox
                                checked={forRemoval === id}
                                className={styles.teamTransferListItemRemovePlayer}
                                onChange={handleSelectRemovePlayer}
                                value={id}
                            />
                        </Popconfirm>
                        <div
                            data-id={id}
                            className={styles.teamTransferListItemPlayer}
                            onClick={onPlayerSelection}
                        >
                            <span className={styles.teamTransferListItemBattingOrder}>
                                {`${battingOrder}.`}
                            </span>
                            <PlayerAvatar src={thumb_link} style={listItemPhotoStyle} />
                            <span
                                className={`${styles.teamTransferListItemName} ${listItemNameSelected}`}
                            >
                                {name}
                            </span>
                        </div>
                    </div>
                );
            })}
            {listItems.length > 0 && (
                <AddPlayer currentPlayers={currentPlayers} team={team} onAddPlayer={onAddPlayer} />
            )}
        </div>
    );
};

TransferListItems.displayName = 'TransferListItems';
TransferListItems.propTypes = {
    listItems: PropTypes.arrayOf(PropTypes.shape),
    onAddPlayer: PropTypes.func,
    onRemovePlayer: PropTypes.func,
    onPlayerSelection: PropTypes.func,
    selected: PropTypes.arrayOf(PropTypes.shape),
    team: PropTypes.string,
};
TransferListItems.defaultProps = {
    listItems: [],
    selected: [],
};
export default TransferListItems;
