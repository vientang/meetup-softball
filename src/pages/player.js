import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { withFilterBar, CareerStats, PlayerGameLog, PlayerInfo } from '../components';

const mockCareerStats = [
    {
        gp: '2',
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

const gameStats = [
    {
        game: 'Game 245 WWS',
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
        sac: '1',
    },
];

class Player extends React.Component {
    constructor() {
        super();
        this.state = {
            careerStats: {},
            games: [],
            player: {},
        };
    }

    async componentDidMount() {
        if (typeof window === 'undefined') {
            return;
        }

        // playerData contains name, games, profile, photos, etc.
        const playerData = get(this.props, 'location.state.player', {});

        if (playerData.meetupId && playerData.games) {
            // routed by user action - selecting player by search or link
            await localStorage.setItem('currentPlayer', JSON.stringify(playerData));
            this.updateState({ player: playerData });
        } else {
            // routed by browser navigation or browser refresh
            // local state doesn't persist and props.location.state is gone
            // but we've saved it in localStorage so we're good!
            const playerDataInMemory =
                (await JSON.parse(localStorage.getItem('currentPlayer'))) || {};
            this.updateState({ player: playerDataInMemory });
        }
    }

    componentDidUpdate(prevProps) {
        const { player } = this.state;
        const { filters } = this.props;

        const playerData = get(this.props, 'location.state.player', {});

        // update games log only when filters have changed
        if (!isEqual(prevProps.filters, filters) || playerData.meetupId !== player.meetupId) {
            const gamesToFilter = player.games || playerData.games;
            const filteredGames = filterGameStats(filters, gamesToFilter);
            this.updateState({ player: playerData, games: filteredGames });
        }
    }

    componentWillUnmount() {
        const playerInMemory = localStorage.getItem('currentPlayer');

        if (playerInMemory) {
            localStorage.removeItem('currentPlayer');
        }
    }

    updateState = ({ player, games }) => {
        const allGames = player.games ? JSON.parse(player.games) : [];
        const careerStats = calculatePlayerCareerStats(allGames);
        const filteredGames = games || filterGameStats(this.props.filters, allGames);
        this.setState(() => ({
            player,
            games: filteredGames,
            careerStats,
        }));
    };

    render() {
        const { careerStats, games, player } = this.state;

        return (
            <>
                <PlayerInfo playerInfo={player} />
                <CareerStats stats={mockCareerStats || careerStats} />
                <PlayerGameLog stats={games.length ? games : gameStats} />
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
function filterGameStats(filters, games = []) {
    // TODO: cache return value to avoid unnecessary filter operations
    return games
        .filter((game) => {
            if (
                game.year === filters.year ||
                game.month === filters.month ||
                game.field === filters.field ||
                game.batting === filters.batting
            ) {
                return true;
            }
            return false;
        })
        .map((game) => {
            return {
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
            };
        });
}

/**
 * Calculate career stats based on non-filtered games
 * This should be called only once in componentDidMount
 * @param {Object} games
 */
function calculatePlayerCareerStats(games) {
    // TODO: cache return value to avoid recalculating stats
    return games;
}

Player.displayName = 'Player';
Player.propTypes = {
    allPlayers: PropTypes.arrayOf(PropTypes.shape),
    filters: PropTypes.shape(),
    gameData: PropTypes.arrayOf(PropTypes.shape),
    location: PropTypes.shape(),
};

Player.defaultProps = {
    allPlayers: [],
    filters: {},
    gameData: [],
    location: {},
};

export default withFilterBar(Player);
