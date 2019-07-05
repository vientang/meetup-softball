import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Button } from 'antd';
import TransferBox from './TransferBox';
import componentStyles from './components.module.css';

const WINNERS = 'WINNERS';
const LOSERS = 'LOSERS';
class TeamTransfer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focusedItem: {},
            gameId: '',
            sourceList: [],
            targetList: [],
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.gameId && nextProps.gameId === prevState.gameId) {
            return null;
        }

        const playersWithBattingOrder = addBattingOrder(nextProps.players);
        return {
            gameId: nextProps.gameId,
            sourceList: playersWithBattingOrder,
        };
    }

    /**
     * Set focused item on click
     * Deselect focused item if previous === current
     */
    setFocusedPlayer = (e) => {
        e.preventDefault();
        const { sourceList, targetList } = this.state;
        const focusedItemId = e.currentTarget.getAttribute('data-id');

        const selectedPlayer = [...sourceList, ...targetList].find(
            (player) => player.id.toString() === focusedItemId,
        );

        this.setState((prevState) => {
            const prevFocusedId = get(prevState, 'focusedItem.id', null);
            return {
                focusedItem: prevFocusedId === selectedPlayer.id ? null : selectedPlayer,
            };
        });
    };

    getListToSort = (id) => {
        const { targetList, sourceList } = this.state;

        return id === WINNERS ? [...sourceList] : [...targetList];
    };

    handleAddPlayer = (player, listType) => {
        if (player && listType) {
            this.setState(({ sourceList, targetList }) => {
                if (listType === WINNERS) {
                    return {
                        sourceList: [...sourceList, player],
                    };
                }
                return {
                    targetList: [...targetList, player],
                };
            }, this.handleChange);
        }
    };

    /**
     * Update winners and losers in SortTeams
     * Called when list values change
     */
    handleChange = () => {
        const { sourceList, targetList } = this.state;
        this.props.onChange(sourceList, targetList);
    };

    /**
     * Adds items to target box
     */
    handleMoveToTarget = () => {
        const { focusedItem, targetList, sourceList } = this.state;

        // sort player to source if in sourceList
        const validMove = sourceList.find((player) => player.id === focusedItem.id);

        if (focusedItem && validMove) {
            const newSourceList = addBattingOrder(
                sourceList.filter((player) => player.id !== focusedItem.id),
            );
            const newTargetList = addBattingOrder([...targetList, focusedItem]);

            this.setState(
                () => ({
                    sourceList: newSourceList,
                    targetList: newTargetList,
                }),
                this.handleChange,
            );
        }
    };

    /**
     * Remove items from target box
     */
    handleMoveToSource = () => {
        const { focusedItem, targetList, sourceList } = this.state;

        // sort player to source if in targetList
        const validMove = targetList.find((player) => player.id === focusedItem.id);

        if (focusedItem && validMove) {
            const newSourceList = addBattingOrder([...sourceList, focusedItem]);
            const newTargetList = addBattingOrder(
                targetList.filter((player) => player.id !== focusedItem.id),
            );

            this.setState(
                () => ({
                    sourceList: newSourceList,
                    targetList: newTargetList,
                }),
                this.handleChange,
            );
        }
    };

    /**
     * Move items up by one space
     */
    handleUp = (e) => {
        const { focusedItem } = this.state;

        if (focusedItem) {
            const listBoxId = e.target.id;
            const list = this.getListToSort(listBoxId);

            const sortedList = sortBattingOrder({
                direction: 'up',
                focusedItem,
                list,
            });

            this.setState(
                (prevState) => ({
                    sourceList: listBoxId === WINNERS ? sortedList : prevState.sourceList,
                    targetList: listBoxId === LOSERS ? sortedList : prevState.targetList,
                }),
                this.handleChange,
            );
        }
    };

    /**
     * Move items down by one space
     */
    handleDown = (e) => {
        const { focusedItem } = this.state;
        const listBoxId = e.target.id;

        if (focusedItem) {
            const list = this.getListToSort(listBoxId);

            const sortedList = sortBattingOrder({
                direction: 'down',
                focusedItem,
                list,
            });

            this.setState(
                (prevState) => ({
                    sourceList: listBoxId === WINNERS ? sortedList : prevState.sourceList,
                    targetList: listBoxId === LOSERS ? sortedList : prevState.targetList,
                }),
                this.handleChange,
            );
        }
    };

    render() {
        const { targetList, focusedItem, sourceList } = this.state;
        const allRsvpIds = [...sourceList, ...targetList].map((player) => player.id);
        const buttonProps = { size: 'small', shape: 'circle' };

        return (
            <div className={componentStyles.teamTransferBoxContainer}>
                <TransferBox
                    allRsvpIds={allRsvpIds}
                    focusedItem={focusedItem}
                    listItems={sourceList}
                    listType={WINNERS}
                    onAddPlayer={this.handleAddPlayer}
                    onPlayerFocus={this.setFocusedPlayer}
                    onMoveUp={this.handleUp}
                    onMoveDown={this.handleDown}
                />
                <div className={componentStyles.teamTransferOperations}>
                    <Button onClick={this.handleMoveToTarget} icon="right" {...buttonProps} />
                    <Button onClick={this.handleMoveToSource} icon="left" {...buttonProps} />
                </div>
                <TransferBox
                    allRsvpIds={allRsvpIds}
                    focusedItem={focusedItem}
                    listItems={targetList}
                    listType={LOSERS}
                    onAddPlayer={this.handleAddPlayer}
                    onPlayerFocus={this.setFocusedPlayer}
                    onMoveUp={this.handleUp}
                    onMoveDown={this.handleDown}
                />
            </div>
        );
    }
}

function addBattingOrder(players) {
    return players.map((player, i) => ({ ...player, battingOrder: i + 1 }));
}

function sortBattingOrder({ focusedItem, list, direction }) {
    const listToSort = [...list];
    const currIndex = listToSort.findIndex((target) => target.id === focusedItem.id);
    const playerToMove = listToSort[currIndex];

    // sort players inside a list
    // account for boundaries
    if (direction === 'up' && currIndex > 0) {
        const playerToSwap = listToSort[currIndex - 1];
        listToSort[currIndex - 1] = playerToMove;
        listToSort[currIndex] = playerToSwap;

        return addBattingOrder(listToSort);
    }
    if (direction === 'down' && currIndex < list.length - 1) {
        const playerToSwap = listToSort[currIndex + 1];
        listToSort[currIndex + 1] = playerToMove;
        listToSort[currIndex] = playerToSwap;

        return addBattingOrder(listToSort);
    }

    return listToSort;
}

TeamTransfer.propTypes = {
    /* eslint-disable react/no-unused-prop-types */
    gameId: PropTypes.string,
    onChange: PropTypes.func,
    players: PropTypes.arrayOf(PropTypes.shape()),
};

TeamTransfer.defaultProps = {
    gameId: '',
    players: [],
};

export default TeamTransfer;
