import React from 'react';
import PropTypes from 'prop-types';
import StatsTable from './StatsTable';
import AdminSection from './AdminSection';
import Button from './Button';
import { sortByNameLength } from '../utils/helpers';
import { adminStatCategories } from '../utils/constants';
import statsCalc from '../utils/statsCalc';
import componentStyles from './components.module.css';
import 'react-table/react-table.css';

const { getAtBats, getHits } = statsCalc;

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
        return nextState.dataSubmitted;
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
        const value = Number(e.key);

        // do not save any values that are not numbers
        if (isNaN(value)) {
            return false;
        }

        const winners = [...this.state.winners];
        winners[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;

        this.setState(() => ({ winners }));

        return null;
    };

    /**
     * Save loser entries to state
     * @param cellInfo - meta data for each cell
     */
    handleLoserEntry = (cellInfo) => (e) => {
        const value = Number(e.key);

        // do not save any values that are not numbers
        if (isNaN(value)) {
            return false;
        }

        const losers = [...this.state.losers];
        losers[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;

        this.setState(() => ({ losers }));

        return null;
    };

    renderWinnerEditableCell = (cellInfo) => {
        const makeContentEditable = this.makeContentEditable(cellInfo);

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
        const makeContentEditable = this.makeContentEditable(cellInfo);

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
        const { winners, losers, invalidStats, tooltipMsg } = this.state;

        if (!winners || winners.length < 1) {
            return null;
        }

        return (
            <AdminSection title="ENTER STATS" iconType="table" iconColor="#1890ff">
                <p className={componentStyles.adminSectionTitle}>WINNERS</p>
                <StatsTable
                    stats={winners}
                    categories={adminStatCategories}
                    cellRenderer={this.renderWinnerEditableCell}
                    showPagination={false}
                    sortMethod={sortByNameLength}
                    adminPage
                />
                <p className={componentStyles.adminSectionTitle}>LOSERS</p>
                <StatsTable
                    stats={losers}
                    categories={adminStatCategories}
                    cellRenderer={this.renderLoserEditableCell}
                    showPagination={false}
                    sortMethod={sortByNameLength}
                    adminPage
                />
                <Button
                    disabled={invalidStats}
                    onClick={this.handleSubmitData}
                    tooltipMsg={tooltipMsg}
                >
                    SUBMIT
                </Button>
            </AdminSection>
        );
    }
}

function getDerivedStateFromProps(props, state) {
    const { invalidStats, tooltipMsg } = checkForInvalidStats(state);

    if (invalidStats) {
        return { invalidStats, tooltipMsg };
    }
    return { invalidStats, tooltipMsg };
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
    onSubmit: PropTypes.func,
    selectedGame: PropTypes.string,
};

AdminStatsTable.defaultProps = {
    winners: [],
    losers: [],
};

export default AdminStatsTable;
