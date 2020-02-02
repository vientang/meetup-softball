import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import pick from 'lodash/pick';
import AdminSection from './AdminSection';
import StatsTable from '../StatsTable';
import Button from '../Button';
import { StringCheck, sortByNameLength } from '../../utils/helpers';
import { adminStatCategories } from '../../utils/constants';
import styles from './dashboard.module.css';
import 'react-table/react-table.css';

class AdminStatsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSubmitted: false,
            losers: props.losers,
            tooltipMsg: '',
            winners: props.winners,
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextProps.playerOfTheGame.id !== this.props.playerOfTheGame.id ||
            nextState.dataSubmitted
        );
    }

    handleSubmitData = (e) => {
        e.preventDefault();
        const { onSubmit, selectedGame } = this.props;
        const { winners, losers } = this.state;
        const { w, l } = preprocessWinnersAndLosers(winners, losers);
        onSubmit(w, l, selectedGame);
        this.setState(() => ({ dataSubmitted: true }));
    };

    makeContentEditable = (cellInfo) =>
        cellInfo.column.id !== 'battingOrder' && cellInfo.column.id !== 'name';

    /**
     * Prevent non numeric keys from being triggered
     * Prevent enter key from going to a new line
     * @param e - event object from keyDown event
     */
    handleNonNumericKeys = (e) => {
        const enterKey = e.key === 'Enter';
        const tabKey = e.key === 'Tab';
        const leftKey = e.key === 'ArrowLeft';
        const rightKey = e.key === 'ArrowRight';
        const backSpaceKey = e.key === 'Backspace';
        const charKeys = isNaN(Number(e.key));

        // keep default browser behavior for these keys
        if (backSpaceKey || tabKey || leftKey || rightKey) {
            return true;
        }

        // prevent default behavior of these keys
        if (enterKey || charKeys) {
            e.preventDefault();
        }

        return null;
    };

    /**
     * Save winner entries to state
     * @param cellInfo - meta data for each cell
     */
    handleWinnerEntry = (cellInfo) => (e) => {
        const {
            column: { id },
            index,
            original,
        } = cellInfo;
        const value = Number(e.key);

        // do not save any values that are not numbers
        if (isNaN(value)) {
            return false;
        }

        // note, this does not affect how stats are displayed in the cell
        const winners = [...this.state.winners];
        winners[index][id] = e.target.innerHTML;
        this.setState(() => ({ winners }));
        this.props.onChange(original);

        return null;
    };

    /**
     * Save loser entries to state
     * @param cellInfo - meta data for each cell
     */
    handleLoserEntry = (cellInfo) => (e) => {
        const {
            column: { id },
            index,
            original,
        } = cellInfo;
        const value = Number(e.key);

        // do not save any values that are not numbers
        if (isNaN(value)) {
            return false;
        }

        // note, this does not affect how stats are displayed in the cell
        const losers = [...this.state.losers];
        losers[index][id] = e.target.innerHTML;

        this.setState(() => ({ losers }));
        this.props.onChange(original);
        return null;
    };

    renderWinnerEditableCell = (cellInfo) => {
        const { playerOfTheGame, onSetPlayerOfTheGame } = this.props;
        const makeContentEditable = this.makeContentEditable(cellInfo);

        if (cellInfo.column.id === 'potg') {
            const { id } = cellInfo.original;
            return (
                <Checkbox
                    value={id}
                    onChange={onSetPlayerOfTheGame}
                    checked={playerOfTheGame.id === id}
                />
            );
        }
        return (
            <div
                contentEditable={makeContentEditable}
                suppressContentEditableWarning
                onKeyDown={this.handleNonNumericKeys}
                onKeyUp={this.handleWinnerEntry(cellInfo)}
            >
                {this.state.winners[cellInfo.index][cellInfo.column.id]}
            </div>
        );
    };

    renderLoserEditableCell = (cellInfo) => {
        const { playerOfTheGame, onSetPlayerOfTheGame } = this.props;
        const makeContentEditable = this.makeContentEditable(cellInfo);

        if (cellInfo.column.id === 'potg') {
            const { id } = cellInfo.original;
            return (
                <Checkbox
                    value={id}
                    onChange={onSetPlayerOfTheGame}
                    checked={playerOfTheGame.id === id}
                />
            );
        }
        return (
            <div
                contentEditable={makeContentEditable}
                suppressContentEditableWarning
                onKeyDown={this.handleNonNumericKeys}
                onKeyUp={this.handleLoserEntry(cellInfo)}
            >
                {this.state.losers[cellInfo.index][cellInfo.column.id]}
            </div>
        );
    };

    render() {
        const { winners, losers, tooltipMsg } = this.state;

        if (!winners || winners.length < 1) {
            return null;
        }

        return (
            <AdminSection title="ENTER STATS" iconType="table" iconColor="#1890ff">
                <p className={styles.adminSectionTitle}>WINNERS</p>
                <StatsTable
                    stats={winners}
                    categories={adminStatCategories}
                    cellRenderer={this.renderWinnerEditableCell}
                    showPagination={false}
                    sortMethod={sortByNameLength}
                    adminPage
                />
                <p className={styles.adminSectionTitle}>LOSERS</p>
                <StatsTable
                    stats={losers}
                    categories={adminStatCategories}
                    cellRenderer={this.renderLoserEditableCell}
                    showPagination={false}
                    sortMethod={sortByNameLength}
                    adminPage
                />
                <Button onClick={this.handleSubmitData} tooltipMsg={tooltipMsg}>
                    SUBMIT
                </Button>
            </AdminSection>
        );
    }
}

function preprocessWinnersAndLosers(winners, losers) {
    return {
        w: prepareGamePlayers(winners.players),
        l: prepareGamePlayers(losers.players),
    };
}

function prepareGamePlayers(players = []) {
    return players.map((player) => {
        const currentPlayer = pick(player, ['id', 'name']);
        const normalizeStats = prepareStats(player);
        return { ...currentPlayer, ...normalizeStats };
    });
}

function prepareStats(stats) {
    // pick out just the stat categories -> { bb, cs, r, rbi, ... }
    const playerStats = pick(stats, [
        'battingOrder',
        'bb',
        'singles',
        'doubles',
        'triples',
        'r',
        'rbi',
        'hr',
        'sb',
        'cs',
        'sac',
        'k',
        'l',
        'w',
        'o',
    ]);
    Object.keys(playerStats).forEach((stat) => {
        const value = playerStats[stat];
        const isNull = StringCheck.null(value);
        const isEmptyString = StringCheck.empty(value);
        const isNumber = StringCheck.number(value);
        const isInvalid = StringCheck.invalid(value);
        // stat is null, empty string or NaN, convert to '0'
        if (isNull || isEmptyString || isInvalid) {
            playerStats[stat] = '0';
        }

        // number, convert to string
        if (isNumber) {
            playerStats[stat] = `${value}`;
        }
    });
    return playerStats;
}

AdminStatsTable.propTypes = {
    winners: PropTypes.arrayOf(PropTypes.object),
    losers: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func,
    onSetPlayerOfTheGame: PropTypes.func,
    onSubmit: PropTypes.func,
    playerOfTheGame: PropTypes.shape(),
    selectedGame: PropTypes.string,
};

AdminStatsTable.defaultProps = {
    winners: [],
    losers: [],
    playerOfTheGame: {},
};

export default AdminStatsTable;
