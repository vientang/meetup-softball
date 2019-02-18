/**
 * Make a player object with stat categories to show on AdminStatsTable
 * @param {Object} player data from meetup
 * @return {Object}
 */
const createPlayer = (player) => {
    return {
        singles: null,
        doubles: null,
        triples: null,
        bb: null,
        cs: null,
        hr: null,
        k: null,
        meetupId: player.member.member_id,
        photos: player.member_photo,
        name: player.member.name,
        o: null,
        r: null,
        rbi: null,
        sac: null,
        sb: null,
    };
};

const game1Players = [
    'Vien',
    'Mike',
    'Steven',
    'Cory',
    'John',
    'Jason',
    'Wynn',
    'Al',
    'Carlos',
    'Cameron',
    'Efrain',
    'Kevin H',
    'Kevin A',
    'Dale',
    'James',
    'Brendan',
    'Eli',
    'Hector',
];

const game2Players = [
    'Annabel',
    'Eida',
    'Carlos',
    'Mike B OG',
    'New Mike B',
    'Michael',
    'Dale',
    'Jessica',
    'Matthew',
    'Tall Matthew',
    'Chris',
    'Efrain',
    'Santiago',
    'Vien',
    'Earl',
    'Brendan',
    'Laura',
    'Natcha',
];

/**
 * Data model to show on AdminStatsTable
 * @param {String} player
 * @param {Number} index
 * @return {Object}
 */
const newPerson = (player, index) => {
    return {
        '1b': null,
        '2b': null,
        '3b': null,
        bb: null,
        cs: null,
        hr: null,
        id: `${player}${index}`,
        k: null,
        meetupId: null,
        name: player,
        o: null,
        r: null,
        rbi: null,
        sac: null,
        sb: null,
    };
};

const makeData = (game) => {
    const players = game === 1 ? game1Players : game2Players;
    return players.map((p, idx) => {
        return {
            ...newPerson(p, idx),
        };
    });
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

const mockGameStats = {
    id: 'xxxxxxxcqyxmbcb', // name.toLowerCase().slice(0, 7).split(' ').join('')_${meetup.id}
    date: new Date(), // meetup.local_date
    time: '1535823000000', // meetup.local_time
    field: 'Westlake', // meetup.venue.name
    isTournament: false, // playerStats.isTournament
    tournamentName: '', // playerStats.tournamentName
    isGameTied: false, // playerStats.isGameTied
    winners: {
        runsScored: '13',
        teamName: 'Winners', // playerStats.teamName
        players: [],
    },
    losers: {
        runsScored: '13',
        teamName: 'Losers', // playerStats.teamName
        players: [],
    },
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
    makeData,
    mockGameStats,
    sortByNameLength,
    sortHighToLow,
    setTopLeaders,
};
