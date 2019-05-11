/* eslint-disable indent */
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import TransferListItem from './TransferListItem';
import Winners from './Winners';
import Losers from './Losers';
import componentStyles from './components.module.css';

const TransferBox = (props) => {
    const { header, listItems, locale, focusedItem, onItemFocus, onMoveDown, onMoveUp } = props;
    const focusedItemId = focusedItem && focusedItem.meetupId;
    return (
        <div className={componentStyles.teamTransferList}>
            <div className={componentStyles.teamTransferHeader}>
                <span className={componentStyles.teamTransferTitle}>
                    {header === 'WINNERS' ? (
                        <Winners gStyle={{ transform: 'translate(-80px, -20px)' }} size={20} />
                    ) : (
                        <Losers gStyle={{ transform: 'translate(-150px, 0px)' }} size={20} />
                    )}
                    {header}
                </span>
                <span className={componentStyles.teamTransferBoxCount}>{listItems.length}</span>
            </div>
            <div className={componentStyles.teamTransferListItems}>
                {listItems.map((player) => {
                    return (
                        <TransferListItem
                            focused={player.meetupId === focusedItemId}
                            key={player.meetupId}
                            onClick={onItemFocus}
                            value={player.name}
                        >
                            <div className={componentStyles.teamTransferItemName}>
                                <span className={componentStyles.teamTransferBattingOrder}>
                                    {player.battingOrder}
                                </span>
                                <span>{player.name}</span>
                            </div>
                        </TransferListItem>
                    );
                })}
            </div>
            <div className={componentStyles.teamTransferSortOperations}>
                <Button
                    id={header}
                    icon="caret-up"
                    type="primary"
                    onClick={onMoveUp}
                    title={locale.moveUp}
                    size="small"
                    shape="circle"
                />
                <Button
                    id={header}
                    icon="caret-down"
                    type="primary"
                    onClick={onMoveDown}
                    title={locale.moveDown}
                    size="small"
                    shape="circle"
                />
            </div>
        </div>
    );
};

TransferBox.propTypes = {
    focusedItem: PropTypes.shape(),
    header: PropTypes.string,
    listItems: PropTypes.arrayOf(PropTypes.object),
    locale: PropTypes.shape({
        moveUp: PropTypes.string,
        moveDown: PropTypes.string,
    }),
    onItemFocus: PropTypes.func,
    onMoveDown: PropTypes.func,
    onMoveUp: PropTypes.func,
};

TransferBox.defaultProps = {
    header: '',
    listItems: [],
    locale: {},
};

export default TransferBox;
