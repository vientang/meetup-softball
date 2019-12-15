import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { CareerStats, GameLog, Layout, PlayerInfo } from '../components';
import { fetchPlayerStats } from '../utils/apiService';
import { buildFilterMenu } from '../utils/helpers';

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
        this.setState(() => ({
            games,
            player,
        }));
    };

    render() {
        const {
            data: {
                softballstats: { metadata },
            },
        } = this.props;
        const { filters, games, player } = this.state;
        const dataLoaded = player.id && games.length;
        const filterBarOptions = {
            menu: buildFilterMenu(filters, metadata),
            disabled: true,
            filters,
        };

        return (
            <Layout
                filterBarOptions={filterBarOptions}
                loading={!dataLoaded}
                players={JSON.parse(metadata.activePlayers)}
                inactivePlayers={JSON.parse(metadata.inactivePlayers)}
            >
                <PlayerInfo meetupId={player.id} />
                <CareerStats stats={player.games} />
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
function filterGameStats(filters = {}, games = []) {
    // TODO: cache return value to avoid unnecessary filter operations
    return games
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

// graphql aliases https://graphql.org/learn/queries/#aliases
export const query = graphql`
    query {
        softballstats {
            metadata: getMetaData(id: "_metadata") {
                id
                activePlayers
                allYears
                inactivePlayers
                perYear
            }
        }
    }
`;

Player.propTypes = {
    data: PropTypes.shape(),
    filters: PropTypes.shape(),
    location: PropTypes.shape(),
};

Player.defaultProps = {
    data: {},
};

export default Player;
