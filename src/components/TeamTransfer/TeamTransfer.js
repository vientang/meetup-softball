import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import TransferBox from './TransferBox';
import { findPlayerById } from '../../utils/helpers';
import styles from './transfer.module.css';

const WINNERS = 'WINNERS';
const LOSERS = 'LOSERS';

class TeamTransfer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameId: '',
            selected: [],
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
            targetList: [],
        };
    }

    /**
     * Select one or multiple (using checkboxes)
     * Deselect selected item too
     */
    handlePlayerSelection = (e) => {
        e.preventDefault();
        const selectedId = this.getSelectedPlayerId(e);
        // console.log('selection', selectedId);
        const selectedPlayers = this.findSelectedPlayers(selectedId);
        this.setState(() => ({ selected: selectedPlayers }));
    };

    getSelectedPlayerId = (e) => e.target.value || (e.currentTarget || {}).getAttribute('data-id');

    findSelectedPlayers = (id) => {
        const { selected, sourceList, targetList } = this.state;
        let selectedPlayers = [...selected];
        const selectedPlayerId = id.toString();

        const selectedPlayer = findPlayerById(selectedPlayerId, [...sourceList, ...targetList]);
        const prevSelected = findPlayerById(selectedPlayerId, selected);

        if (prevSelected) {
            // deselect if player was previously selected
            selectedPlayers = selectedPlayers.filter((selected) => selected.id !== prevSelected.id);
        } else {
            selectedPlayers.push(selectedPlayer);
        }

        return selectedPlayers;
    };

    getListToSort = (id) => {
        const { targetList, sourceList } = this.state;

        return id === WINNERS ? [...sourceList] : [...targetList];
    };

    removeSelectedPlayers = (list = [], selected = []) =>
        list.filter((player) => !findPlayerById(player.id, selected));

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

    handleRemovePlayer = (player, listType) => {
        if (player && listType) {
            // console.log('remove player', { player, listType });
            this.setState(({ sourceList, targetList }) => {
                if (listType === WINNERS) {
                    return {
                        sourceList: addBattingOrder(sourceList.filter((p) => p.id !== player.id)),
                    };
                }
                return {
                    targetList: addBattingOrder(targetList.filter((p) => p.id !== player.id)),
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
        const { selected, targetList, sourceList } = this.state;

        // sort players to target if they are in sourceList
        const filteredSourceList = this.removeSelectedPlayers(sourceList, selected);

        const newSourceList = addBattingOrder(filteredSourceList);
        const newTargetList = addBattingOrder([...targetList, ...selected]);

        this.setState(
            () => ({
                sourceList: newSourceList,
                targetList: newTargetList,
                selected: [],
            }),
            this.handleChange,
        );
    };

    /**
     * Remove items from target box
     */
    handleMoveToSource = () => {
        const { selected, targetList, sourceList } = this.state;

        // sort player to source if in targetList
        // const validMove = targetList.find((player) => player.id === selected.id);
        const filteredTargetList = this.removeSelectedPlayers(targetList, selected);

        const newSourceList = addBattingOrder([...sourceList, ...selected]);
        const newTargetList = addBattingOrder(filteredTargetList);

        this.setState(
            () => ({
                sourceList: newSourceList,
                targetList: newTargetList,
                selected: [],
            }),
            this.handleChange,
        );
    };

    /**
     * Move items up by one space
     */
    handleUp = (e) => {
        const { selected } = this.state;

        if (selected) {
            const listBoxId = e.target.id;
            const list = this.getListToSort(listBoxId);

            const sortedList = sortBattingOrder({
                direction: 'up',
                selected: selected[selected.length - 1],
                list,
            });

            this.setState(
                (prevState) => ({
                    sourceList: listBoxId === WINNERS ? sortedList : prevState.sourceList,
                    targetList: listBoxId === LOSERS ? sortedList : prevState.targetList,
                    selected: [selected[selected.length - 1]],
                }),
                this.handleChange,
            );
        }
    };

    /**
     * Move items down by one space
     */
    handleDown = (e) => {
        const { selected } = this.state;
        const listBoxId = e.target.id;

        if (selected) {
            const list = this.getListToSort(listBoxId);

            const sortedList = sortBattingOrder({
                direction: 'down',
                selected: selected[selected.length - 1],
                list,
            });

            this.setState(
                (prevState) => ({
                    sourceList: listBoxId === WINNERS ? sortedList : prevState.sourceList,
                    targetList: listBoxId === LOSERS ? sortedList : prevState.targetList,
                    selected: [selected[selected.length - 1]],
                }),
                this.handleChange,
            );
        }
    };

    render() {
        const { targetList, selected, sourceList } = this.state;

        const buttonProps = { size: 'small', shape: 'circle' };

        return (
            <div className={styles.teamTransferBoxContainer}>
                <TransferBox
                    listItems={sourceList}
                    listType={WINNERS}
                    onAddPlayer={this.handleAddPlayer}
                    onRemovePlayer={this.handleRemovePlayer}
                    onPlayerSelection={this.handlePlayerSelection}
                    onMoveUp={this.handleUp}
                    onMoveDown={this.handleDown}
                    selected={selected}
                />
                <div className={styles.teamTransferOperations}>
                    <Button onClick={this.handleMoveToTarget} icon="right" {...buttonProps} />
                    <Button onClick={this.handleMoveToSource} icon="left" {...buttonProps} />
                </div>
                <TransferBox
                    listItems={targetList}
                    listType={LOSERS}
                    onAddPlayer={this.handleAddPlayer}
                    onRemovePlayer={this.handleRemovePlayer}
                    onPlayerSelection={this.handlePlayerSelection}
                    onMoveUp={this.handleUp}
                    onMoveDown={this.handleDown}
                    selected={selected}
                />
            </div>
        );
    }
}

function addBattingOrder(players) {
    return players
        .map((player, i) => ({ ...player, battingOrder: i + 1 }))
        .filter((player) => player.id);
}

function sortBattingOrder({ direction, selected, list }) {
    const listToSort = [...list];
    const currIndex = listToSort.findIndex((target) => target.id === selected.id);
    const playerToMove = { ...selected };

    // sort players inside a list and account for boundaries
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
    gameId: PropTypes.string,
    onChange: PropTypes.func,
    players: PropTypes.arrayOf(PropTypes.shape()),
};

TeamTransfer.defaultProps = {
    gameId: '',
    players: [],
};

export default TeamTransfer;
