import React from 'react';
import PropTypes from 'prop-types';
import { CareerStats, FilterBar, GameLog, Layout, PlayerInfo } from '../components';
import { fetchPlayer } from '../utils/apiService';
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
import pageStyles from './pages.module.css';

class Player extends React.Component {
    constructor() {
        super();
        this.state = {
            filters: {
                year: '2018',
                month: '',
                field: '',
            },
            games: [],
            player: {},
            statsByYear: [],
            statsByField: [],
        };
    }

    async componentDidMount() {
        const { filters, location } = this.props;

        const playerId = location.href.split('=').pop();
        const playerData = await fetchPlayer(playerId);

        if (playerData && playerData.id) {
            this.updateState({
                games: filterGameStats(filters, playerData.games),
                player: playerData,
            });
        }
    }

    async componentDidUpdate() {
        const { player } = this.state;
        const { filters, location } = this.props;

        const playerId = location.href.split('=').pop();
        const playerData = await fetchPlayer(playerId);

        if (playerData && playerData.id !== player.id) {
            this.updateState({
                games: filterGameStats(filters, playerData.games),
                player: playerData,
            });
        }
    }

    updateState = ({ player, games }) => {
        const allGames = player.games || [];

        this.setState(() => ({
            statsByYear: this.calculateCareerStats(allGames),
            statsByField: this.calculateFieldStats(allGames),
            games,
            player,
        }));
    };

    calculateCareerStats = (games) => {
        if (this.careerStats) {
            return this.careerStats;
        }
        const careerStats = {};
        const parsedGames = typeof games === 'string' ? JSON.parse(games) : games;
        parsedGames.forEach((game) => {
            if (careerStats[game.year]) {
                careerStats[game.year] = [calculateTotals(careerStats[game.year], game)];
            } else {
                careerStats[game.year] = [];
                careerStats[game.year].push(calculateTotals(careerStats[game.year], game));
            }
        });
        return transformCareerStats(careerStats, 'year');
    };

    calculateFieldStats = (games) => {
        if (this.fieldStats) {
            return this.fieldStats;
        }
        const fieldStats = {};
        const parsedGames = typeof games === 'string' ? JSON.parse(games) : games;
        parsedGames.forEach((game) => {
            if (fieldStats[game.field]) {
                fieldStats[game.field] = [calculateTotals(fieldStats[game.field], game)];
            } else {
                fieldStats[game.field] = [];
                fieldStats[game.field].push(calculateTotals(fieldStats[game.field], game));
            }
        });
        return transformCareerStats(fieldStats, 'field');
    };

    render() {
        const { filters, statsByField, statsByYear, games, player } = this.state;

        return (
            <Layout
                className={pageStyles.pageLayout}
                filterBar={<FilterBar filters={filters} disabled />}
            >
                <PlayerInfo data={player} />
                <CareerStats statsByField={statsByField} statsByYear={statsByYear} />
                <GameLog stats={games} />
            </Layout>
        );
    }
}

/**
 * Filter games for games log
 * This should be called on mount and when filters are updated
 * @param {Object} filters
 * @param {Array} games
 */
function filterGameStats(filters = {}, games) {
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

function transformCareerStats(careerStats, key) {
    return Object.keys(careerStats).map((type) => {
        const stats = careerStats[type][0];
        stats[key] = type;
        return stats;
    });
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

Player.propTypes = {
    filters: PropTypes.shape(),
    location: PropTypes.shape(),
};

export default Player;
