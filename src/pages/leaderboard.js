import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Layout, LeaderCard } from '../components';
import pageStyles from './pages.module.css';

const filters = {
    year: '2018',
    month: '',
    field: '',
};

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

const LeaderBoard = (props) => {
    const {
        data: {
            softballstats: {
                summarized: { stats },
                players: { items },
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
        const playerToInsert = {
            name: player.name,
            id: player.id,
            [stat]: player[stat],
            gp: player.gp,
        };
        // build leaders with first 5 players
        if (leaders.length < 5) {
            leaders.push(playerToInsert);
        } else {
            leaders = sortLeaders({ leaders, player: playerToInsert, stat });
        }
    });
    return leaders;
}

function sortLeaders({ leaders, player, stat }) {
    const statValue = player[stat];
    const lastIndex = leaders.length - 1;
    const lastPlayer = leaders[lastIndex];
    let sortedLeaders = leaders.sort((a, b) => (a[stat] < b[stat] ? 1 : -1));
    // minimum qualifier is the last item in sorted array
    const minQualifier = lastPlayer[stat];
    const rankIndex = sortedLeaders.findIndex((leader) => statValue >= leader[stat]);

    // TODO: inlude minimum number of games played into the condition

    // player met the minimum qualifier requirement
    if (statValue > minQualifier) {
        if (rankIndex === 0) {
            // player is top dawg
            sortedLeaders = [player, ...sortedLeaders.slice(0, lastIndex)];
        } else if (rankIndex > 0) {
            // TODO: handle ties here
            sortedLeaders = [
                ...sortedLeaders.slice(0, rankIndex),
                player,
                ...sortedLeaders.slice(rankIndex, lastIndex),
            ];
        }
    }

    return sortedLeaders;
}

LeaderBoard.propTypes = {
    data: PropTypes.shape(),
};

LeaderBoard.defaultProps = {
    data: {},
};

export default LeaderBoard;
