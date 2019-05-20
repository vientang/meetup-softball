/* eslint-disable indent */
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import Winners from './Winners';
import Losers from './Losers';
import AddPlayer from './AddPlayer';
import componentStyles from './components.module.css';

/* eslint-disable-next-line react/prop-types */
const TransferHeader = ({ listType, playerCount }) => {
    const winnerLogoStyle = { transform: 'translate(-80px, -20px)' };
    const loserLogoStyle = { transform: 'translate(-80px, -20px)' };
    return (
        <div className={componentStyles.teamTransferHeader}>
            <span className={componentStyles.teamTransferTitle}>
                {listType === 'WINNERS' ? (
                    <Winners gStyle={winnerLogoStyle} size={20} />
                ) : (
                    <Losers gStyle={loserLogoStyle} size={20} />
                )}
                {listType}
            </span>
            <span className={componentStyles.teamTransferBoxCount}>{playerCount}</span>
        </div>
    );
};

const TransferListItems = (props) => {
    /* eslint-disable-next-line react/prop-types */
    const { allRsvpIds, listItems, listType, onAddPlayer, onPlayerFocus, focusedItemId } = props;

    return (
        <div className={componentStyles.teamTransferListItems}>
            {listItems.map((player) => {
                const focusedStyle =
                    player.meetupId === focusedItemId
                        ? componentStyles.teamTransferListItemFocused
                        : null;
                return (
                    <div
                        key={player.meetupId}
                        className={`${componentStyles.teamTransferListItem} ${focusedStyle}`}
                        data-id={player.meetupId}
                        onClick={onPlayerFocus}
                    >
                        <span className={componentStyles.teamTransferListItemName}>
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

/* eslint-disable-next-line react/prop-types */
const TransferSortOperations = ({ listType, onMoveDown, onMoveUp }) => (
    <div className={componentStyles.teamTransferSortOperations}>
        {['caret-up', 'caret-down'].map((icon) => (
            <Button
                key={icon}
                id={listType}
                icon={icon}
                type="primary"
                onClick={icon === 'caret-up' ? onMoveUp : onMoveDown}
                size="small"
                shape="circle"
                title={icon === 'caret-up' ? 'Move up' : 'Move down'}
            />
        ))}
    </div>
);

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

    const focusedItemId = focusedItem && focusedItem.meetupId;

    return (
        <div className={componentStyles.teamTransferList}>
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
