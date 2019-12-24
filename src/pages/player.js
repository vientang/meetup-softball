import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Layout } from '../components';
import { CareerStats, GameLog, PlayerInfo } from '../components/Player';
import { usePlayerStats } from '../utils/hooks';

const Player = ({ location }) => {
    const id = location.href.split('=').pop();
    const player = usePlayerStats(id);

    const games = useMemo(() => {
        return getGameStats(player.games);
    }, [player.games]);

    const filterBarOptions = {
        menu: {},
        disabled: true,
        filters: {},
    };

    const dataLoaded = player.id && games.length;

    return (
        <Layout filterBarOptions={filterBarOptions} loading={!dataLoaded}>
            <PlayerInfo id={player.id} />
            <CareerStats stats={player.games} />
            <GameLog stats={games} />
        </Layout>
    );
};

function getGameStats(games = []) {
    return games.map((game) => ({
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
    location: PropTypes.shape(),
};

export default Player;
