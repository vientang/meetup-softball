import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Button } from 'antd';
import componentStyles from './components.module.css';
import TransferBox from './TransferBox';

const addBattingOrder = (players) =>
    players.map((player, i) => ({ ...player, battingOrder: i + 1 }));

const sortBattingOrder = ({ focusedItem, list, direction }) => {
    const listToSort = [...list];
    const currIndex = listToSort.findIndex((target) => target.meetupId === focusedItem.meetupId);
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
     * Set focused item on click
     * Deselect focused item if previous === current
     */
    setFocusedItem = (e) => {
        e.preventDefault();
        const focusedItem = e.currentTarget.getAttribute('data-id');
        const selectedPlayer = this.props.players.find((value) => value.name === focusedItem);
        this.setState((prevState) => {
            const prevFocused = get(prevState, 'focusedItem.name', null);
            return { focusedItem: prevFocused === selectedPlayer.name ? null : selectedPlayer };
        });
    };

    getListToSort = (id) => {
        const {
            locale: { source },
        } = this.props;

        const { targetList, sourceList } = this.state;

        return id === source ? [...sourceList] : [...targetList];
    };

    handleChange = () => {
        const { sourceList, targetList } = this.state;
        this.props.onChange(sourceList, targetList);
    };

    findPlayerByMeetupId = (meetupId) => (player) => player.meetupId === meetupId;

    /**
     * Adds items to target box
     */
    handleMoveToTarget = () => {
        const { focusedItem, targetList, sourceList } = this.state;

        // sort player to source if in sourceList
        const validMove = sourceList.find((player) => player.meetupId === focusedItem.meetupId);

        if (focusedItem && validMove) {
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
        }
    };

    /**
     * Remove items from target box
     */
    handleMoveToSource = () => {
        const { focusedItem, targetList, sourceList } = this.state;

        // sort player to source if in targetList
        const validMove = targetList.find((player) => player.meetupId === focusedItem.meetupId);

        if (focusedItem && validMove) {
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
        }
    };

    /**
     * Move items up by one space
     */
    handleUp = (e) => {
        const {
            locale: { source, target },
        } = this.props;

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
                    sourceList: listBoxId === source ? sortedList : prevState.sourceList,
                    targetList: listBoxId === target ? sortedList : prevState.targetList,
                }),
                this.handleChange,
            );
        }
    };

    /**
     * Move items down by one space
     */
    handleDown = (e) => {
        const {
            locale: { source, target },
        } = this.props;

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
                    sourceList: listBoxId === source ? sortedList : prevState.sourceList,
                    targetList: listBoxId === target ? sortedList : prevState.targetList,
                }),
                this.handleChange,
            );
        }
    };

    render() {
        const { locale } = this.props;
        const { targetList, focusedItem, sourceList } = this.state;

        return (
            <div className={componentStyles.teamTransferBoxContainer}>
                <TransferBox
                    focusedItem={focusedItem}
                    listItems={sourceList}
                    locale={locale}
                    header={locale.source}
                    onItemFocus={this.setFocusedItem}
                    onMoveUp={this.handleUp}
                    onMoveDown={this.handleDown}
                />
                <div className={componentStyles.teamTransferOperations}>
                    <Button
                        onClick={this.handleMoveToTarget}
                        title={locale.moveToTarget}
                        icon="right"
                    />
                    <Button
                        onClick={this.handleMoveToSource}
                        title={locale.moveToSource}
                        icon="left"
                    />
                </div>
                <TransferBox
                    focusedItem={focusedItem}
                    listItems={targetList}
                    locale={locale}
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
        moveUp: 'Move Up',
        moveDown: 'Move Down',
    },
    players: [],
};

export default TeamTransfer;
