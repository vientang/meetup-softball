import { rateStats } from './constants';

export default function createLeaderBoard(summarizedStats = []) {
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
    // const lastIndex = topFivePlayers.length - 1;
    const remainingPlayers = leaders.slice(5);
    const ties = [];
    const hasTies = remainingPlayers.some((player) => {
        if (player[stat] === topFivePlayers[4][stat]) {
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
