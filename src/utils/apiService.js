import get from 'lodash/get';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import transform from 'lodash/transform';
import statsCalc from './statsCalc';

const {
    getAtBats,
    getAverage,
    getHits,
    getOnBasePercentage,
    getOPS,
    getRunsCreated,
    getSlugging,
    getTeamRunsScored,
    getTeamTotalHits,
    getTotalBases,
    getWOBA,
} = statsCalc;

const stats = [
    'battingOrder',
    'bb',
    'cs',
    'doubles',
    'gp',
    'hr',
    'k',
    'l',
    'o',
    'r',
    'rbi',
    'sac',
    'sb',
    'singles',
    'triples',
    'w',
];

const gameProperties = [
    'date',
    'field',
    'lat',
    'lon',
    'month',
    'name',
    'time',
    'timeStamp',
    'tournamentName',
    'year',
];

const ignoreKeystoTransform = [
    'id',
    'meetupId',
    'name',
    'avg',
    'h',
    'ab',
    'tb',
    'rc',
    'key',
    'obp',
    'ops',
    'slg',
    'woba',
];

/**
 * LIST OF PLAYER STATS
 * HOLDS ALL OF THE RESOLVED STATS BASED ON A SPECIFIC FILTER
 */
const masterList = new Map();
const clearMasterList = () => {
    masterList.clear();
};

/**
 * Stringify values and combine into one object
 * @param {*} adminStats
 * @param {*} derivedStats
 * @return {Object}
 */
const combineDerivedStats = (adminStats, derivedStats) => {
    const derivedWithStrings = {};
    Object.keys(derivedStats).forEach((key) => {
        derivedWithStrings[key] = String(derivedStats[key]);
    });
    return Object.assign(adminStats, derivedWithStrings);
};

/**
 * Calculate cumulative stats from current game and the running total
 * This can be used generically after filtering data from database
 * @return {Object} updated stats for an individual player
 */
const mergePlayerStatsForView = (existingStats = {}, currentStats) => {
    const countingStats = {
        first: Number(currentStats.singles),
        second: Number(currentStats.doubles),
        third: Number(currentStats.triples),
        hr: Number(currentStats.hr),
        o: Number(currentStats.o),
        bb: Number(currentStats.bb),
        cs: Number(currentStats.cs),
        sb: Number(currentStats.sb),
        sac: Number(currentStats.sac),
    };

    const { bb, cs, first, second, sb, third, hr, o, sac } = countingStats;
    // only add existing stats if it's there
    // otherwise, we'll get NaN
    let hits = getHits(first, second, third, hr);
    if (existingStats.h) {
        hits += Number(existingStats.h);
    }

    let atBats = getAtBats(hits, o);
    if (existingStats.ab && Number(get(existingStats, 'ab')) > 0) {
        atBats += Number(get(existingStats, 'ab'));
    }

    const avg = getAverage(hits, atBats);

    let totalBases = getTotalBases(first, second, third, hr);
    if (Number(get(existingStats, 'tb'))) {
        totalBases += Number(get(existingStats, 'tb'));
    }

    const walks = bb + Number(existingStats.bb);
    const stolenBases = sb + Number(existingStats.sb);
    const caughtStealing = cs + Number(existingStats.cs);
    const runsCreated = getRunsCreated(
        hits,
        walks,
        caughtStealing,
        totalBases,
        stolenBases,
        atBats,
    );

    const onBasePercentage = getOnBasePercentage(hits, bb, atBats, sac);
    const slugging = getSlugging(totalBases, atBats);
    const onBasePlusSlugging = getOPS(onBasePercentage, slugging);
    const weightedOnBaseAverage = getWOBA(bb, first, second, third, hr, atBats, sac);

    const transformStats = (result, value, key) => {
        /* eslint-disable no-param-reassign */
        if (ignoreKeystoTransform.includes(key)) {
            result[key] = value;
        } else {
            result[key] = existingStats[key]
                ? (Number(value) + Number(existingStats[key])).toString()
                : Number(value).toString();
        }
    };

    const updatedStats = transform(currentStats, transformStats, {});

    return combineDerivedStats(updatedStats, {
        h: hits,
        ab: atBats,
        tb: totalBases,
        rc: runsCreated,
        obp: onBasePercentage,
        slg: slugging,
        ops: onBasePlusSlugging,
        woba: weightedOnBaseAverage,
        avg,
    });
};

/**
 * Build up master list with updated player stats
 * @return {Map} map of player stats
 */
const updateEntries = (gamePlayers, allPlayers) => {
    gamePlayers.forEach((player) => {
        const countingStats = {
            first: Number(player.singles),
            second: Number(player.doubles),
            third: Number(player.triples),
            hr: Number(player.hr),
            o: Number(player.o),
            bb: Number(player.bb),
            cs: Number(player.cs),
            sb: Number(player.sb),
        };

        if (masterList.has(player.name)) {
            const existingStats = allPlayers.find(
                (prevPlayerStat) => prevPlayerStat.name === player.name,
            );
            const newStats = mergePlayerStatsForView(existingStats, player);
            masterList.set(player.name, newStats);
        } else {
            const { bb, cs, first, second, sb, third, hr, o, sac } = countingStats;

            const h = getHits(first, second, third, hr);
            const ab = getAtBats(h, o);
            const avg = getAverage(h, ab);
            const tb = getTotalBases(first, second, third, hr);
            const rc = getRunsCreated(h, bb, cs, tb, sb, ab);
            const obp = getOnBasePercentage(h, bb, ab, sac);
            const slg = getSlugging(tb, ab);
            const ops = getOPS(obp, slg);
            const woba = getWOBA(bb, first, second, third, hr, ab, sac);

            const playerStats = combineDerivedStats(player, {
                h,
                ab,
                avg,
                tb,
                rc,
                slg,
                obp,
                ops,
                woba,
            });

            masterList.set(playerStats.name, playerStats);
        }
    });

    return masterList;
};

/**
 * Combines winners and losers
 * @return {Array} list of updated player stats
 */
const filterPlayerStats = (gameData, allPlayers) => {
    const winners = JSON.parse(gameData.winners);
    const losers = JSON.parse(gameData.losers);
    const gamePlayers = winners.players.concat(losers.players);

    return updateEntries(gamePlayers, allPlayers);
};

/**
 * Add stats that can be derived from playing a game
 * Admins do not need to enter these
 * @param {Array} players
 * @param {Boolean} winner
 * @return {Array}
 */
const addDerivedStats = (players, winner) =>
    players.map((player) => {
        player.w = winner ? '1' : '0';
        player.l = winner ? '0' : '1';
        player.gp = '1';
        return player;
    });

/**
 * GAMESTATS Adaptor to combine data from meetup and current game stats
 * @param {Array} meetupData - data from meetup api
 * @param {Array} currentStats - all player stats from current game
 * @return {Object} currentGameStats
 */
const mergeGameStats = (meetupData, w, l) => {
    const currentGameStats = omit(meetupData, ['players']);

    const winningTeam = addDerivedStats(w, true);
    const losingTeam = addDerivedStats(l);

    const winners = {
        name: 'Winners', // swap with data from the admin
        runsScored: getTeamRunsScored(winningTeam),
        totalHits: getTeamTotalHits(winningTeam),
        players: winningTeam,
    };
    const losers = {
        name: 'Losers', // swap with data from the admin
        runsScored: getTeamRunsScored(losingTeam),
        totalHits: getTeamTotalHits(losingTeam),
        players: losingTeam,
    };

    currentGameStats.winners = JSON.stringify(winners);
    currentGameStats.losers = JSON.stringify(losers);

    return currentGameStats;
};

/**
 * Create a game log for each player
 * @param {*} players
 * @param {*} currentGameStats
 */
const createPlayerGameLog = (players, currentGameStats) => {
    return players.map((player) => {
        const gameStats = pick(player, stats);
        const playerStats = {};
        playerStats.name = player.name;
        playerStats.meetupId = player.meetupId;
        playerStats.photos = player.photos;
        playerStats.games = [];
        playerStats.games.push({ ...currentGameStats, ...gameStats });
        return playerStats;
    });
};

/**
 * PLAYERSTATS Adaptor to combine data from meetup and current game stats
 * @param {Array} currentGame - data from meetup api
 * @param {Array} currentStats - all player stats from current game
 * @return {Object} currentGameStats
 */
const mergePlayerStats = (currentGame, w, l) => {
    const currentGameStats = pick(currentGame, gameProperties);
    const winningTeam = addDerivedStats(w, true);
    const winners = createPlayerGameLog(winningTeam, currentGameStats);
    const losingTeam = addDerivedStats(l);
    const losers = createPlayerGameLog(losingTeam, currentGameStats);

    return winners.concat(losers);
};

export default {
    addDerivedStats,
    clearMasterList,
    filterPlayerStats,
    mergeGameStats,
    mergePlayerStats,
};
