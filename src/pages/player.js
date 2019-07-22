import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import dataProvider from '../utils/dataProvider';
import { CareerStats, GameLog, PlayerInfo, SplitStats } from '../components';
import { fetchPlayer } from '../utils/helpers';
import {
    getAtBats,
    getAverage,
    getHits,
    getOnBasePercentage,
    getOPS,
    getRunsCreated,
    getSlugging,
    getTotalBases,
    getWOBA,
} from '../utils/statsCalc';

const careerStatsByField = [
    {
        field: 'Parkside',
        gp: '29',
        w: '.529',
        singles: '10',
        doubles: '11',
        triples: '12',
        hr: '1',
        rbi: '1',
        r: '1',
        sb: '1',
        cs: '0',
        k: '1',
        bb: '1',
        avg: '.600',
        ab: '1',
        tb: '1',
        rc: '.800',
        h: '1',
        sac: '1',
    },
    {
        field: 'Aptos',
        gp: '52',
        w: '.529',
        singles: '1',
        doubles: '1',
        triples: '1',
        hr: '1',
        rbi: '1',
        r: '1',
        sb: '1',
        cs: '0',
        k: '1',
        bb: '1',
        avg: '.600',
        ab: '1',
        tb: '1',
        rc: '.800',
        h: '1',
        sac: '1',
    },
];

class Player extends React.Component {
    constructor() {
        super();
        this.state = {
            careerStatsByYear: [],
            games: [],
            player: {},
        };
    }

    async componentDidMount() {
        const { filters, location } = this.props;

        const playerData = await fetchPlayer(get(location, 'state.playerId', null));

        if (playerData) {
            this.updateState({
                games: filterGameStats(filters, playerData.games),
                player: playerData,
            });
        }
        // if (playerId && playerData.games) {
        //     // routed by user action - selecting player by search or link
        //     await localStorage.setItem('currentPlayer', JSON.stringify(playerData));
        //     const filteredGames = filterGameStats(this.props.filters, playerData.games);
        //     this.updateState({ player: playerData, games: filteredGames });
        // } else {
        //     // routed by browser navigation or browser refresh
        //     // local state doesn't persist and props.location.state is gone
        //     // but we've saved it in localStorage so we're good!
        //     const playerDataInMemory =
        //         (await JSON.parse(localStorage.getItem('currentPlayer'))) || {};
        //     const filteredGames = filterGameStats(this.props.filters, playerDataInMemory.games);
        //     this.updateState({
        //         player: playerDataInMemory,
        //         games: filteredGames,
        //     });
        // }
    }

    async componentDidUpdate(prevProps) {
        const { player } = this.state;
        const { filters, location } = this.props;

        const playerData = await fetchPlayer(get(location, 'state.playerId', null));

        if (playerData && playerData.id !== player.id) {
            this.updateState({
                games: filterGameStats(filters, playerData.games),
                player: playerData,
            });
        }
    }

    componentWillUnmount() {
        const playerInMemory = localStorage.getItem('currentPlayer');

        if (playerInMemory) {
            localStorage.removeItem('currentPlayer');
        }
    }

    updateState = ({ player, games }) => {
        const allGames = player.games || [];
        this.setState(() => ({
            careerStatsByYear: calculateCareerStats(allGames, { type: 'year', value: '2013' }),
            games,
            player,
        }));
    };

    render() {
        const { careerStatsByYear, games, player } = this.state;

        const statsTableStyle = {
            width: 1155,
        };

        return (
            <>
                <PlayerInfo data={player} />
                <SplitStats stats={careerStatsByField} style={statsTableStyle} />
                <CareerStats
                    statsByField={careerStatsByField}
                    statsByYear={careerStatsByYear}
                    style={statsTableStyle}
                />
                <GameLog stats={games} style={statsTableStyle} />
            </>
        );
    }
}

/**
 * Filter games for games log
 * This should be called on mount and when filters are updated
 * @param {Object} filters
 * @param {Array} games
 */
function filterGameStats(filters, games) {
    let parsedGames = games || [];
    if (typeof games === 'string') {
        parsedGames = JSON.parse(games);
    }
    // TODO: cache return value to avoid unnecessary filter operations
    return parsedGames
        .filter(
            (game) =>
                game.year === filters.year ||
                game.month === filters.month ||
                game.field === filters.field ||
                game.batting === filters.batting,
        )
        .map((game) => ({
            date: game.date.slice(3),
            game: game.name,
            battingOrder: game.battingOrder,
            singles: game.singles,
            doubles: game.doubles,
            triples: game.triples,
            hr: game.hr,
            rbi: game.rbi,
            r: game.r,
            sb: game.sb,
            cs: game.cs,
            k: game.k,
            bb: game.bb,
            ab: game.ab,
            sac: game.sac,
        }));
}

/**
 * Calculate career stats
 * @param {Array} games
 * @param {Object} options - { type: 'year', value: '2019' }
 */
function calculateCareerStats(games, options) {
    // TODO: cache return value to avoid recalculating stats
    let careerStats = {};
    let parsedGames = typeof games === 'string' ? JSON.parse(games) : games;
    if (options) {
        parsedGames = parsedGames.filter((game) => game[options.type] === options.value);
    }

    parsedGames.forEach((game) => {
        careerStats = calculateTotals(careerStats, game);
    });

    return [careerStats];
}

function calculateTotals(existingStats = {}, currentStats = {}) {
    const { bb, cs, singles, doubles, sb, triples, hr, o, sac } = currentStats;

    const totalSingles = addStat(singles, existingStats.singles);
    const totalDoubles = addStat(doubles, existingStats.doubles);
    const totalTriples = addStat(triples, existingStats.triples);
    const totalHr = addStat(hr, existingStats.hr);
    const totalOuts = addStat(o, existingStats.o);
    const totalHits = getHits(totalSingles, totalDoubles, totalTriples, totalHr);
    const totalAb = getAtBats(totalHits, totalOuts);
    const totalTb = getTotalBases(totalSingles, totalDoubles, totalTriples, totalHr);
    const totalWalks = addStat(bb, existingStats.bb);
    const totalSacs = addStat(sac, existingStats.sac);
    const totalStls = addStat(sb, existingStats.sb);
    const totalCs = addStat(cs, existingStats.cs);
    const obp = getOnBasePercentage(totalHits, totalWalks, totalAb, totalSacs);
    const slg = getSlugging(totalTb, totalAb);
    const cumulativeAvg = getAverage(totalHits, totalAb);
    const rc = getRunsCreated(totalHits, totalWalks, totalCs, totalTb, totalStls, totalAb);
    const ops = getOPS(obp, slg);
    const woba = getWOBA(
        totalWalks,
        totalSingles,
        totalDoubles,
        totalTriples,
        totalHr,
        totalAb,
        totalSacs,
    );

    return {
        ab: totalAb,
        avg: cumulativeAvg,
        bb: totalWalks,
        cs: totalCs,
        doubles: totalDoubles,
        gp: addStat(currentStats.gp, existingStats.gp),
        h: totalHits,
        hr: totalHr,
        k: addStat(currentStats.k, existingStats.k),
        l: addStat(currentStats.l, existingStats.l),
        o: totalOuts,
        rbi: addStat(currentStats.rbi, existingStats.rbi),
        r: addStat(currentStats.r, existingStats.r),
        sac: totalSacs,
        sb: totalStls,
        singles: totalSingles,
        tb: totalTb,
        triples: totalTriples,
        w: addStat(currentStats.w, existingStats.w),
        obp,
        ops,
        rc,
        slg,
        woba,
    };
}

function addStat(currentStat, existingStat) {
    if (!existingStat) {
        return Number(currentStat);
    }

    return Number(existingStat) + Number(currentStat);
}

Player.displayName = 'Player';
Player.propTypes = {
    filters: PropTypes.shape(),
    location: PropTypes.shape(),
};

Player.defaultProps = {
    filters: {},
    location: {},
};

export default dataProvider(Player);
