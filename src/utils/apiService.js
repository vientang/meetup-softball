import pick from 'lodash/pick';
import omit from 'lodash/omit';
import transform from 'lodash/transform';
import statsCalc from './statsCalc';
import { gameProperties, ignoreKeystoTransform } from './constants';

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

/**
 * LIST OF PLAYER STATS
 * HOLDS ALL OF THE RESOLVED STATS BASED ON A SPECIFIC FILTER
 */
const masterList = new Map();
export function clearMasterList() {
    masterList.clear();
}

/**
 * StatsPage
 * Runs a double loop to accumulate stats
 * of all players in every game
 * @param {Array} games
 * @return {Array} list of players and their stats
 */
export function getAllPlayerStats(games) {
    masterList.clear();
    let playerStats = [];

    games.forEach((game) => {
        playerStats = getPlayerStats(game);
    });

    return playerStats;
}

/**
 * Update master stats list at runtime
 * @return {Array} list of players and their stats
 */
function getPlayerStats(game) {
    getWinnersAndLosers(game).forEach((player) => {
        if (masterList.has(player.name)) {
            masterList.set(
                player.name,
                mergeExistingPlayerStats(masterList.get(player.name), player),
            );
        } else {
            masterList.set(player.name, initNewPlayerStats(player));
        }
    });

    return Array.from(masterList.values());
}

/**
 * Prepare initial stat values
 * @return {Object} legacy player data
 */
function initNewPlayerStats(player) {
    const { bb, cs, singles, doubles, sb, triples, hr, o, sac } = player;

    const h = getHits(singles, doubles, triples, hr);
    const ab = getAtBats(h, o);
    const tb = getTotalBases(singles, doubles, triples, hr);
    const obp = getOnBasePercentage(h, bb, ab, sac);
    const slg = getSlugging(tb, ab);

    const derivedStats = {
        avg: getAverage(h, ab),
        rc: getRunsCreated(h, bb, cs, tb, sb, ab),
        ops: getOPS(obp, slg),
        woba: getWOBA(bb, singles, doubles, triples, hr, ab, sac),
        h,
        ab,
        tb,
        slg,
        obp,
    };

    const metaData = parsePhotosAndProfile(player);

    return { ...player, ...metaData, ...derivedStats };
}

/**
 * Parse and concat winners and losers
 * @return {Array} list of winners and losers
 */
function getWinnersAndLosers(game) {
    return JSON.parse(game.winners).players.concat(JSON.parse(game.losers).players);
}

/**
 * Add stats that can be derived from playing a game
 * Admins do not need to enter these
 * @param {Array} players
 * @param {Boolean} winner
 * @param {Boolean} isTie
 * @return {Array}
 */
export function addDerivedStats(players, isTie, winner) {
    return players.map((player) => {
        const derivedStats = { ...player };
        derivedStats.w = winner ? '1' : '0';
        derivedStats.l = winner ? '0' : '1';
        derivedStats.gp = '1';
        if (isTie) {
            derivedStats.w = '0';
            derivedStats.l = '0';
        }
        return derivedStats;
    });
}

/**
 * GAMESTATS Adaptor to combine data from meetup and current game stats
 * @param {Array} meetupData - data from meetup api
 * @param {Array} w - winners
 * @param {Array} l - losers
 * @return {Object} currentGameStats
 */
export function mergeGameStats(meetupData, w, l) {
    const currentGameStats = omit(meetupData, ['players']);
    const isTie = getTeamRunsScored(w) === getTeamRunsScored(l);

    const winningTeam = addDerivedStats(w, isTie, true);
    const losingTeam = addDerivedStats(l, isTie, false);

    const winners = {
        name: 'Winners',
        runsScored: getTeamRunsScored(winningTeam),
        totalHits: getTeamTotalHits(winningTeam),
        players: winningTeam,
    };
    const losers = {
        name: 'Losers',
        runsScored: getTeamRunsScored(losingTeam),
        totalHits: getTeamTotalHits(losingTeam),
        players: losingTeam,
    };

    currentGameStats.winners = JSON.stringify(winners);
    currentGameStats.losers = JSON.stringify(losers);

    return currentGameStats;
}

/**
 * PLAYERSTATS Adaptor to combine data from meetup and current game stats
 * @param {Array} meetupData - data from meetup api
 * @param {Array} w - winners
 * @param {Array} l - losers
 * @return {Array} list of players and their stats
 */
export function mergePlayerStats(meetupData, w, l) {
    const currentGameStats = pick(meetupData, gameProperties);
    const isTie = getTeamRunsScored(w) === getTeamRunsScored(l);
    const winners = createPlayerData(addDerivedStats(w, isTie, true), currentGameStats);
    const losers = createPlayerData(addDerivedStats(l, isTie), currentGameStats);

    return winners.concat(losers);
}

/**
 * Stringify values and combine into one object
 * @param {Object} derivedStats
 * @return {Object}
 */
function transformDerivedStatsToStrings(derivedStats) {
    const derivedWithStrings = {};

    Object.keys(derivedStats).forEach((key) => {
        derivedWithStrings[key] = String(derivedStats[key]);
    });

    return derivedWithStrings;
}

/**
 * Calculate cumulative stats from the current game and the running total
 * @param {Object} existingStats
 * @param {Object} currentStats
 * @return {Object} updated stats for an individual player
 */
function mergeExistingPlayerStats(existingStats = {}, currentStats = {}) {
    const { bb, cs, singles, doubles, sb, triples, hr, o, sac } = currentStats;

    const h = getHits(singles, doubles, triples, hr) + existingStats.h;
    const atBats = getAtBats(h, o) + existingStats.ab;
    const tb = getTotalBases(singles, doubles, triples, hr) + existingStats.tb;
    const avg = getAverage(h, atBats);
    const walks = bb + existingStats.bb;
    const steals = sb + existingStats.sb;
    const cSteals = cs + existingStats.cs;
    const rc = getRunsCreated(h, walks, cSteals, tb, steals, atBats);
    const obp = getOnBasePercentage(h, bb, atBats, sac);
    const slg = getSlugging(tb, atBats);
    const ops = getOPS(obp, slg);
    const woba = getWOBA(bb, singles, doubles, triples, hr, atBats, sac);

    // transform stats to strings while ignoring keys in existingStats
    const transformStats = (result, value, key) => {
        /* eslint-disable no-param-reassign */
        if (ignoreKeystoTransform.includes(key)) {
            result[key] = value;
        } else {
            result[key] = transformStatsToStrings(currentStats, value, key);
        }
    };

    const updatedStats = transform(existingStats, transformStats, {});
    const derivedStats = transformDerivedStatsToStrings({
        ab: atBats,
        battingOrder: updatedStats.battingOrder,
        h,
        obp,
        ops,
        rc,
        slg,
        tb,
        avg,
        woba,
    });

    return { ...updatedStats, ...derivedStats };
}

/**
 * Validate, add, then transform stats to strings
 * @param {Array} currentStats
 * @param {Number} value
 * @param {String} key
 * @return {String} stat value
 */
function transformStatsToStrings(currentStats, value, key) {
    if (value === null) {
        return value;
    }
    if (currentStats[key]) {
        return (value + currentStats[key]).toString();
    }
    if (value === 0) {
        return '0';
    }
    return value.toString();
}

/**
 * Create player data
 * @param {*} players
 * @param {*} currentGameStats
 */
function createPlayerData(players, currentGameStats) {
    return players.map((player) => {
        const playerStats = {};
        playerStats.name = player.name;
        playerStats.joined = player.joined;
        playerStats.meetupId = player.meetupId;
        playerStats.profile = JSON.stringify(player.profile);
        playerStats.admin = player.admin;
        playerStats.photos = JSON.stringify(player.photos);
        playerStats.status = player.status || 'active';
        playerStats.gender = player.gender || 'n/a';
        playerStats.games = [];
        playerStats.games.push({ ...player, ...currentGameStats });
        playerStats.games = playerStats.games;
        return playerStats;
    });
}

/**
 * Parse the profile and photos object from meetup
 * @param {Object} players
 * @return {Object}
 */
function parsePhotosAndProfile(player) {
    const photos = player.photos ? player.photos : {};
    const profile = player.profile ? player.profile : {};
    return {
        photos: JSON.parse(photos),
        profile: JSON.parse(profile),
    };
}
