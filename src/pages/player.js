import React from 'react';
import PropTypes from 'prop-types';
import { CareerStats, FilterBar, GameLog, Layout, PlayerInfo } from '../components';
import { fetchPlayerStats } from '../utils/apiService';
import { calculateTotals } from '../utils/statsCalc';
import pageStyles from './pages.module.css';

const defaultFilters = {
    year: '2018',
    month: '',
    field: '',
};

class Player extends React.Component {
    constructor() {
        super();
        this.state = {
            filters: defaultFilters,
            games: [],
            player: {},
            statsByYear: [],
            statsByField: [],
        };
    }

    async componentDidMount() {
        this.mounted = true;
        const { filters, location } = this.props;

        const playerId = location.href.split('=').pop();
        const playerData = await fetchPlayerStats(playerId);

        if (playerData && playerData.id) {
            this.updateState({
                games: filterGameStats(filters, playerData.games),
                player: playerData,
            });
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        const { filters, location } = this.props;

        const playerId = location.href.split('=').pop();
        const playerData = await fetchPlayerStats(playerId);

        if (this.mounted && playerData && playerData.id !== prevState.player.id) {
            this.updateState({
                games: filterGameStats(filters, playerData.games),
                player: playerData,
            });
        }
    }

    componentWillUnmount() {
        this.mounted = false;
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
        const careerStats = {};
        const parsedGames = typeof games === 'string' ? JSON.parse(games) : games;

        parsedGames.forEach((game) => {
            if (careerStats[game.year]) {
                careerStats[game.year] = calculateTotals(careerStats[game.year], game);
            } else {
                careerStats[game.year] = game;
            }
        });

        return transformCareerStats(careerStats, 'year');
    };

    calculateFieldStats = (games) => {
        const fieldStats = {};
        const parsedGames = typeof games === 'string' ? JSON.parse(games) : games;
        parsedGames.forEach((game) => {
            if (fieldStats[game.field]) {
                fieldStats[game.field] = calculateTotals(fieldStats[game.field], game);
            } else {
                fieldStats[game.field] = game;
            }
        });
        return transformCareerStats(fieldStats, 'field');
    };

    render() {
        const { filters, statsByField, statsByYear, games, player } = this.state;

        return (
            <Layout className={pageStyles.pageLayout} filterBar={<FilterBar filters={filters} />}>
                <PlayerInfo meetupId={player.id} />
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
        const stats = careerStats[type];
        stats[key] = type;
        return stats;
    });
}

Player.propTypes = {
    filters: PropTypes.shape(),
    location: PropTypes.shape(),
};

export default Player;
