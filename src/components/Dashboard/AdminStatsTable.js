import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import AdminSection from './AdminSection';
import StatsTable from '../StatsTable';
import Button from '../Button';
import { sortByNameLength } from '../../utils/helpers';
import { adminStatCategories } from '../../utils/constants';
import { getAtBats, getHits } from '../../utils/statsCalc';
import styles from './dashboard.module.css';
import 'react-table/react-table.css';

class AdminStatsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSubmitted: false,
            invalidStats: true,
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
        const { winners, losers } = this.state;
        e.preventDefault();

        this.props.onSubmit(winners, losers, this.props.selectedGame);
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
                <Button
                    // disabled={invalidStats}
                    onClick={this.handleSubmitData}
                    tooltipMsg={tooltipMsg}
                >
                    SUBMIT
                </Button>
            </AdminSection>
        );
    }
}

function checkForInvalidStats({ winners, losers }) {
    let msg = 'Stats have not been completely entered.';
    const allPlayers = winners.concat(losers);
    // const validHitsAndOuts = checkAllStatsEntered(allPlayers);
    // if (!validHitsAndOuts) {
    //     return { invalidStats: true, tooltipMsg: msg };
    // }
    const invalidStats = allPlayers.some((player) => {
        const { doubles, hr, k, o, r, sac, singles, triples } = player;
        const sing = Number(singles) || 0;
        const doub = Number(doubles) || 0;
        const trip = Number(triples) || 0;
        const homeRuns = Number(hr) || 0;
        const stko = Number(k) || 0;
        const outs = Number(o) || 0;
        const runs = Number(r) || 0;
        const sacFly = Number(sac) || 0;

        const hits = getHits(sing, doub, trip, homeRuns);
        const ab = getAtBats(hits, outs);

        if (stko > outs) {
            msg = `${player.name} has more strikeouts than outs.`;
            return true;
        }
        if (sacFly > ab - hits) {
            msg = `${player.name} has too many sacrifice fly balls.`;
            return true;
        }
        if (runs > ab) {
            msg = `${player.name} has more runs than at bats.`;
            return true;
        }
        return false;
    });
    return { invalidStats, tooltipMsg: invalidStats ? msg : '' };
}

function getDerivedStateFromProps(props, state) {
    const { invalidStats, tooltipMsg } = checkForInvalidStats(state);

    if (invalidStats) {
        return { invalidStats, tooltipMsg };
    }
    return { invalidStats, tooltipMsg };
}

function checkAllStatsEntered(allPlayers) {
    return allPlayers.every((player) => {
        const { bb, doubles, hr, o, sac, singles, triples } = player;
        const sing = Number(singles) || 0;
        const doub = Number(doubles) || 0;
        const trip = Number(triples) || 0;
        const homeRuns = Number(hr) || 0;
        const walks = Number(bb) || 0;
        const sacFly = Number(sac) || 0;
        const outs = Number(o) || 0;
        const hits = getHits(sing, doub, trip, homeRuns);

        if (hits || outs) {
            return true;
        }
        if (sacFly || walks) {
            return true;
        }
        return false;
    });
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
