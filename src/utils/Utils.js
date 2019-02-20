/**
 * Make a player object with stat categories to show on AdminStatsTable
 * @param {Object} player data from meetup
 * @return {Object}
 */
import statsCalc from './statsCalc';

const {
    getAtBats,
    getAverage,
    getHits,
    getOnBasePercentage,
    getOPS,
    getSlugging,
    getTotalBases,
    getWOBA,
} = statsCalc;

const createPlayer = (player) => {
    const { name, id, joined, group_profile, is_pro_admin, photo, status } = player.data;
    return {
        name,
        joined,
        status,
        meetupId: id,
        profile: group_profile,
        admin: is_pro_admin,
        photos: photo,
        singles: null,
        doubles: null,
        triples: null,
        bb: null,
        cs: null,
        hr: null,
        k: null,
        o: null,
        r: null,
        rbi: null,
        sac: null,
        sb: null,
    };
};

const sortByNameLength = (a, b) => {
    if (a.length === b.length) {
        return a > b ? 1 : -1;
    }
    return a.length > b.length ? 1 : -1;
};

const sortHighToLow = (a, b) => {
    const aa = Number(a);
    const bb = Number(b);

    return aa < bb ? 1 : -1;
};

// Loop through all players
// Calculate their counting stat totals
// Check if it belongs in the top 5
// If yes, save the player name and stat total
// If no, don't save
const getCountingStatTotal = (games, statToCount) => {
    return games.reduce((acc, cur) => {
        if (typeof cur[statToCount] === 'number') {
            acc += cur[statToCount];
        } else {
            acc += 0;
        }
        return acc;
    }, 0);
};

const getRateStatTotal = (games, statToCount) => {
    // switch case for each rate stat and calculate for setTopLeaders
    // think about how to involve getCountingStatTotal
    // test in utils.test.js
    const hits = getHits(
        getCountingStatTotal(games, games.singles),
        getCountingStatTotal(games, games.doubles),
        getCountingStatTotal(games, games.triples),
        getCountingStatTotal(games, games.hr),
    );
    const atBats = getAtBats(hits, games.o);

    switch (statToCount) {
        case 'avg':
            return getAverage(hits, atBats); // needs hits and atBats
        case 'obp':
            return getOnBasePercentage(hits, games.bb, atBats, games.sac);
        // needs hits, walks, atBats, and sacrifices
        case 'ops':
            return getOPS(
                getOnBasePercentage(hits, games.bb, atBats, games.sac),
                getSlugging(getTotalBases(games.singles, games.doubles, games.triples, games.hr)),
            ); // needs hits, walks, atBats, sacrifices, and totalBases
        case 'woba':
            return getWOBA(
                games.bb,
                games.singles,
                games.doubles,
                games.triples,
                games.hr,
                atBats,
                games.sac,
            ); // needs walks, singles, doubles, triples, homeRuns, atBats, // and sacrifices
        default:
            return 0;
    }
};

const setTopLeaders = (players, stat) => {
    // return an array of 5 objects
    // describing the player name and their stat total
    let topLeaders = [];
    let comparison = [];

    players.forEach((element) => {
        const playerName = element.name;
        //add if statement here to check for rate or counting stat,
        //maybe look for decimal point
        const total = getCountingStatTotal(element.games, stat);
        comparison.push({ playerName, total });
    });

    comparison = comparison.sort((a, b) => (a.total > b.total ? -1 : 1));

    topLeaders = comparison.slice(0, 5);

    // comparison = comparison.slice(5);
    comparison.slice(5).some((player) => {
        if (player.total === topLeaders[4].total) {
            topLeaders.push(player);
        } else {
            return true;
        }
    });
    return topLeaders;
};

const chainedFunc = (...funcs) =>
    funcs
        .filter((f) => f != null)
        .reduce((acc, f) => {
            if (typeof f !== 'function') {
                throw new Error(
                    'Invalid Argument Type, must only provide functions, undefined, or null.',
                );
            }
            if (acc === null) {
                return f;
            }
            return function chainedFunction(...args) {
                acc.apply(this, args);
                f.apply(this, args);
            };
        }, null);

export default {
    chainedFunc,
    createPlayer,
    sortByNameLength,
    sortHighToLow,
    setTopLeaders,
};
