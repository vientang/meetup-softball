import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Layout, LeaderCard } from '../components';
import { rateStats } from '../utils/constants';
import pageStyles from './pages.module.css';

const filters = {
    year: '2018',
    month: '',
    field: '',
};

const LeaderBoard = (props) => {
    const {
        data: {
            softballstats: {
                players: { items },
                summarized: { stats },
            },
        },
    } = props;

    const filterBarOptions = {
        disabled: true,
        filters,
    };

    const leaders = createLeaderBoard(JSON.parse(stats));

    return (
        <Layout filterBarOptions={filterBarOptions} loading={!leaders} players={items}>
            <div className={pageStyles.leaderBoardPage}>
                {leaders &&
                    Object.keys(leaders).map((stat) => (
                        <LeaderCard key={stat} leaders={leaders[stat]} stat={stat} />
                    ))}
            </div>
        </Layout>
    );
};

function createLeaderBoard(summarizedStats = []) {
    return {
        hr: getLeaders(summarizedStats, 'hr'),
        avg: getLeaders(summarizedStats, 'avg'),
        rbi: getLeaders(summarizedStats, 'rbi'),
        r: getLeaders(summarizedStats, 'r'),
        doubles: getLeaders(summarizedStats, 'doubles'),
        singles: getLeaders(summarizedStats, 'singles'),
        triples: getLeaders(summarizedStats, 'triples'),
        sb: getLeaders(summarizedStats, 'sb'),
    };
}

function getLeaders(summarizedStats = [], stat) {
    let leaders = [];

    summarizedStats.forEach((player) => {
        if (player[stat] === undefined) {
            return;
        }

        const playerToInsert = {
            name: player.name,
            id: player.id,
            gp: player.gp,
            [stat]: player[stat],
        };

        // build leaders with first 5 players
        if (leaders.length < 5) {
            leaders.push(playerToInsert);
        } else {
            leaders = sortLeaders({
                gamesPlayed: summarizedStats.length,
                player: playerToInsert,
                leaders,
                stat,
            });
        }
    });
    return leaders;
}

function sortLeaders({ gamesPlayed, leaders, player, stat }) {
    const statValue = player[stat];
    const lastIndex = leaders.length - 1;
    let sortedLeaders = leaders.sort((a, b) => (a[stat] < b[stat] ? 1 : -1));
    const rankIndex = sortedLeaders.findIndex((leader) => statValue >= leader[stat]);

    const qualifed = isPlayerQualified({
        gamesPlayed,
        lastIndex,
        leaders,
        player,
        stat,
        statValue,
    });

    if (qualifed) {
        if (rankIndex === 0) {
            // player is top dawg
            sortedLeaders = [player, ...sortedLeaders];
        } else if (rankIndex > 0) {
            sortedLeaders = [
                ...sortedLeaders.slice(0, rankIndex),
                player,
                ...sortedLeaders.slice(rankIndex),
            ];
        }
    }

    return getLeadersWithTies(sortedLeaders, stat);
}

function getLeadersWithTies(leaders, stat) {
    const topFivePlayers = leaders.slice(0, 5);
    const lastIndex = topFivePlayers.length - 1;
    const remainingPlayers = leaders.slice(5);
    const ties = [];
    const hasTies = remainingPlayers.some((player) => {
        if (player[stat] === topFivePlayers[lastIndex][stat]) {
            ties.push(player);
            return true;
        }
        return false;
    });
    return hasTies ? [...topFivePlayers, ...ties] : topFivePlayers;
}

function isPlayerQualified({ gamesPlayed, lastIndex, leaders, player, stat, statValue }) {
    // minimum qualifier is the last item in sorted array
    const minStatQualifier = leaders[lastIndex][stat];

    // inlude minimum number of games played for rate stats
    const isRateState = rateStats.includes(stat);
    if (isRateState) {
        const minGamesQualified = player.gp / gamesPlayed > 0.2;
        return minGamesQualified ? statValue > minStatQualifier : false;
    }

    return statValue > minStatQualifier;
}

// graphql aliases https://graphql.org/learn/queries/#aliases
export const query = graphql`
    query {
        softballstats {
            players: listPlayerss(limit: 500) {
                items {
                    id
                    name
                    photos
                }
            }
            summarized: getSummarizedStats(id: "_2018") {
                id
                stats
            }
        }
    }
`;

LeaderBoard.propTypes = {
    data: PropTypes.shape(),
};

LeaderBoard.defaultProps = {
    data: {},
};

export default LeaderBoard;
