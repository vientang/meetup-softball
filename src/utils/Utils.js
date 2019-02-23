/**
 * Make a player object with stat categories to show on AdminStatsTable
 * @param {Object} player data from meetup
 * @return {Object}
 */
const createPlayer = (player) => {
    const { name, id, joined, group_profile, is_pro_admin, photo, active } = player.data;
    return {
        name,
        joined,
        meetupId: id,
        profile: group_profile,
        admin: is_pro_admin,
        photos: photo,
        status: active,
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

const setTopLeaders = (players, stat) => {
    // return an array of 5 objects
    // describing the player name and their hr total
    let topLeaders = [];
    let comparison = [];

    players.forEach((element) => {
        const playerName = element.name;
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

export default {
    createPlayer,
    sortByNameLength,
    sortHighToLow,
    setTopLeaders,
};
