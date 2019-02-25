import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import componentStyles from './components.module.css';
import TransferBox from './TransferBox';

const addBattingOrder = (players) =>
    players.map((player, i) => ({ ...player, battingOrder: i + 1 }));

const sortBattingOrder = (listBoxId, direction) => {
    const { focusedItem, targetList, sourceList } = this.state;

    const listToSort = listBoxId === 'winners' ? [...sourceList] : [...targetList];
    const currIndex = listToSort.findIndex((target) => target.meetupId === focusedItem.meetupId);
    const playerToMove = listToSort[currIndex];

    // swap players in a list
    if (direction === 'up') {
        const playerToSwap = listToSort[currIndex - 1];
        listToSort[currIndex - 1] = playerToMove;
        listToSort[currIndex] = playerToSwap;

        return addBattingOrder(listToSort);
    }
    if (direction === 'down') {
        const playerToSwap = listToSort[currIndex + 1];
        listToSort[currIndex + 1] = playerToMove;
        listToSort[currIndex] = playerToSwap;

        return addBattingOrder(listToSort);
    }

    return listToSort;
};

class TeamTransfer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focusedItem: null,
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
     * Updates the new focused item when up and down keys are pressed.
     * @param focusedItem
     */
    setFocusedItem = (e) => {
        e.preventDefault();
        const focusedItem = e.currentTarget.getAttribute('data-id');
        const selectedPlayer = this.props.players.find((value) => value.name === focusedItem);
        this.setState(() => ({ focusedItem: selectedPlayer }));
    };

    handleChange = () => {
        const { sourceList, targetList } = this.state;
        this.props.onChange(sourceList, targetList);
    };

    /**
     * Adds items to target box
     */
    handleAdd = () => {
        const { focusedItem, targetList, sourceList } = this.state;

        const newSourceList = addBattingOrder(
            sourceList.filter((player) => player.name !== focusedItem.name),
        );
        const newTargetList = addBattingOrder([...targetList, focusedItem]);

        this.setState(
            () => ({
                sourceList: newSourceList,
                targetList: newTargetList,
            }),
            this.handleChange,
        );
    };

    /**
     * Remove items from target box
     */
    handleRemove = () => {
        const { focusedItem, targetList, sourceList } = this.state;

        const newSourceList = addBattingOrder([...sourceList, focusedItem]);
        const newTargetList = addBattingOrder(
            targetList.filter((player) => player.name !== focusedItem.name),
        );

        this.setState(
            () => ({
                sourceList: newSourceList,
                targetList: newTargetList,
            }),
            this.handleChange,
        );
    };

    /**
     * Move items up by one space
     */
    handleUp = (e) => {
        const listBoxId = e.target.id;
        const sortedList = sortBattingOrder(listBoxId, 'up');

        this.setState(
            (prevState) => ({
                sourceList: listBoxId === 'WINNERS' ? sortedList : prevState.sourceList,
                targetList: listBoxId !== 'WINNERS' ? sortedList : prevState.targetList,
            }),
            this.handleChange,
        );
    };

    /**
     * Move items down by one space
     */
    handleDown = (e) => {
        const listBoxId = e.target.id;
        const sortedList = sortBattingOrder(listBoxId, 'down');

        this.setState(
            (prevState) => ({
                sourceList: listBoxId === 'WINNERS' ? sortedList : prevState.sourceList,
                targetList: listBoxId !== 'WINNERS' ? sortedList : prevState.targetList,
            }),
            this.handleChange,
        );
    };

    render() {
        const { locale } = this.props;
        const { targetList, focusedItem, sourceList } = this.state;

        return (
            <div className={componentStyles.teamTransferBoxContainer}>
                <TransferBox
                    listItems={sourceList}
                    focusedItem={focusedItem}
                    header={locale.source}
                    onItemFocus={this.setFocusedItem}
                    onMoveUp={this.handleUp}
                    onMoveDown={this.handleDown}
                />
                <div className={componentStyles.teamTransferOperations}>
                    <Button onClick={this.handleAdd} title={locale.moveToTarget} icon="right" />
                    <Button onClick={this.handleRemove} title={locale.moveToSource} icon="left" />
                </div>
                <TransferBox
                    listItems={targetList}
                    focusedItem={focusedItem}
                    header={locale.target}
                    onItemFocus={this.setFocusedItem}
                    onMoveUp={this.handleUp}
                    onMoveDown={this.handleDown}
                />
            </div>
        );
    }
}

TeamTransfer.propTypes = {
    /* eslint-disable react/no-unused-prop-types */
    gameId: PropTypes.string,
    locale: PropTypes.shape({
        source: PropTypes.string,
        target: PropTypes.string,
        restoreButton: PropTypes.string,
        moveAllToTarget: PropTypes.string,
        moveToTarget: PropTypes.string,
        moveToSource: PropTypes.string,
        moveAllToSource: PropTypes.string,
        moveTop: PropTypes.string,
        moveUp: PropTypes.string,
        moveDown: PropTypes.string,
        moveBottom: PropTypes.string,
        searchPlaceholder: PropTypes.string,
        locales: PropTypes.string,
    }),
    onChange: PropTypes.func,
    players: PropTypes.arrayOf(PropTypes.shape()),
};

TeamTransfer.defaultProps = {
    gameId: '',
    locale: {
        source: 'WINNERS',
        target: 'LOSERS',
        restoreButton: 'Restore defaults',
        moveAllToTarget: 'Move all to Target',
        moveToTarget: 'Move to Losers',
        moveToSource: 'Move to Winners',
        moveAllToSource: 'Move all to Source',
        moveTop: 'Move to Top',
        moveUp: 'Move Up',
        moveDown: 'Move Down',
        moveBottom: 'Move to Bottom',
        searchPlaceholder: 'Search Source',
        locales: 'en-US',
    },
    players: [],
};

export default TeamTransfer;
