import get from 'lodash/get';

export default function createLeaderBoard(summarizedStats = [], metadata, year) {
    const qualifier = getQualifier(metadata, year);
    return {
        hr: getLeaders(summarizedStats, 'hr'),
        avg: getLeaders(summarizedStats, 'avg', qualifier),
        rbi: getLeaders(summarizedStats, 'rbi'),
        r: getLeaders(summarizedStats, 'r'),
        doubles: getLeaders(summarizedStats, 'doubles'),
        singles: getLeaders(summarizedStats, 'singles'),
        triples: getLeaders(summarizedStats, 'triples'),
        sb: getLeaders(summarizedStats, 'sb'),
    };
}

export function getLeaders(summarizedStats, stat, qualifier) {
    let leaders = getInitial(summarizedStats, stat).filter(filterPredicate(qualifier, stat));
    const remaining = getRemaining(summarizedStats, stat).filter(filterPredicate(qualifier, stat));

    // sort leaders in place by comparing stats and qualifying against games played
    if (leaders.length) {
        remaining.forEach((player) => {
            const playerStat = Number(player[stat]);
            const topLeaderStat = Number(leaders[0][stat]);
            // top dawg
            if (playerStat >= topLeaderStat) {
                leaders.unshift(player);
            } else {
                const insertIndex = leaders.findIndex((leader) => playerStat >= leader[stat]);
                if (insertIndex > 0) {
                    leaders.splice(insertIndex, 0, player);
                }
            }
        });
    } else {
        leaders = remaining;
    }

    const topLeaders = leaders.slice(0, 5);
    leaders.slice(5).some((player) => {
        const current = Number(player[stat]);
        const previous = Number(topLeaders[topLeaders.length - 1][stat]);

        if (current > 0 && current === previous) {
            topLeaders.push(player);
            return false;
        }
        return true;
    });

    return topLeaders;
}

export function getInitial(players, stat) {
    const initial = players.slice(0, 5).map((player) => ({
        name: player.name,
        id: player.id,
        gp: player.gp,
        [stat]: player[stat],
    }));
    initial.sort((a, b) => (Number(a[stat]) > Number(b[stat]) ? -1 : 1));
    return initial;
}

export function getRemaining(players, stat) {
    const remaining = players.slice(5).map((player) => ({
        name: player.name,
        id: player.id,
        gp: player.gp,
        [stat]: player[stat],
    }));
    remaining.sort((a, b) => (Number(a[stat]) > Number(b[stat]) ? -1 : 1));
    return remaining;
}

export function getQualifier(metadata, year) {
    const perYear = JSON.parse(metadata.perYear);
    return get(perYear, `${year}.gp`, 1);
}

/**
 * Keep players who:
 *  1. meet the qualifying number of games played
 *  2. have a valid stat entry
 * @param {Number} qualifier
 * @param {String} stat
 */
export function filterPredicate(qualifier, stat) {
    return (player) => {
        const statValue = player[stat];
        if (statValue === null || Number(statValue) === 0) {
            return false;
        }
        // to qualify, player must play at least 20 percent of total games played
        const qualified = Number(player.gp) / Number(qualifier) >= 0.2;
        return !qualifier || qualified;
    };
}
