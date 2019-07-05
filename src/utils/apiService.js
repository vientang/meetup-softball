import pick from 'lodash/pick';
import omit from 'lodash/omit';
import statsCalc from './statsCalc';
import { gameProperties, playerProfileKeys } from './constants';

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
        if (masterList.has(player.id)) {
            masterList.set(player.id, mergeExistingPlayerStats(masterList.get(player.id), player));
        } else {
            masterList.set(player.id, initNewPlayerStats(player));
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
 * Merge player profile properties with calculated stat totals
 * @param {Object} existingStats
 * @param {Object} currentStats
 * @return {Object}
 */
function mergeExistingPlayerStats(existingStats = {}, currentStats = {}) {
    const playerData = pick(existingStats, playerProfileKeys);
    const total = calculateTotals(existingStats, currentStats);

    return { ...playerData, ...total };
}

/**
 * Calculate cumulative stats from the current game and the running total
 * @param {Object} existingStats
 * @param {Object} currentStats
 * @return {Object} updated stats for an individual player
 */
function calculateTotals(existingStats = {}, currentStats = {}) {
    const { bb, cs, singles, doubles, sb, triples, hr, o, sac } = currentStats;

    const totalSingles = addStat(singles, existingStats.singles);
    const totalDoubles = addStat(doubles, existingStats.doubles);
    const totalTriples = addStat(triples, existingStats.triples);
    const totalHr = addStat(hr, existingStats.hr);
    const totalOuts = addStat(o, existingStats.o);
    const totalHits = getHits(totalSingles, totalDoubles, totalTriples, totalHr);
    const totalAb = getAtBats(totalHits, totalOuts);
    const totalTb = getTotalBases(totalSingles, totalDoubles, totalTriples, totalHr);
    const totalWalks = addStat(bb, existingStats.bb);
    const totalSacs = addStat(sac, existingStats.sac);
    const totalStls = addStat(sb, existingStats.sb);
    const totalCs = addStat(cs, existingStats.cs);
    const obp = getOnBasePercentage(totalHits, totalWalks, totalAb, totalSacs);
    const slg = getSlugging(totalTb, totalAb);
    const cumulativeAvg = getAverage(totalHits, totalAb);
    const rc = getRunsCreated(totalHits, totalWalks, totalCs, totalTb, totalStls, totalAb);
    const ops = getOPS(obp, slg);
    const woba = getWOBA(
        totalWalks,
        totalSingles,
        totalDoubles,
        totalTriples,
        totalHr,
        totalAb,
        totalSacs,
    );

    return {
        ab: totalAb,
        avg: cumulativeAvg,
        bb: totalWalks,
        cs: totalCs,
        doubles: totalDoubles,
        gp: addStat(currentStats.gp, existingStats.gp),
        h: totalHits,
        hr: totalHr,
        k: addStat(currentStats.k, existingStats.k),
        l: addStat(currentStats.l, existingStats.l),
        o: totalOuts,
        rbi: addStat(currentStats.rbi, existingStats.rbi),
        r: addStat(currentStats.r, existingStats.r),
        sac: totalSacs,
        sb: totalStls,
        singles: totalSingles,
        tb: totalTb,
        triples: totalTriples,
        w: addStat(currentStats.w, existingStats.w),
        obp,
        ops,
        rc,
        slg,
        woba,
    };
}

function addStat(currentStat, existingStat) {
    if (existingStat === null) {
        return existingStat;
    }

    return Number(existingStat) + Number(currentStat);
}

/**
 * Parse the profile and photos object from meetup
 * @param {Object} players
 * @return {Object}
 */
function parsePhotosAndProfile(player) {
    return {
        photos: player.photos ? JSON.parse(player.photos) : {},
        profile: player.profile ? JSON.parse(player.profile) : {},
    };
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
 * Create player data
 * @param {*} players
 * @param {*} currentGameStats
 */
function createPlayerData(players, currentGameStats) {
    return players.map((player) => {
        const gameStats = omit(player, [
            'name',
            'joined',
            'meetupId',
            'photos',
            'profile',
            'admin',
        ]);
        const playerStats = {};
        playerStats.id = player.meetupId;
        playerStats.name = player.name;
        playerStats.joined = player.joined;
        playerStats.admin = player.admin;
        playerStats.profile = JSON.stringify(player.profile);
        playerStats.photos = JSON.stringify(player.photos);
        playerStats.status = player.status || 'active';
        playerStats.gender = player.gender || 'n/a';
        playerStats.games = [];
        playerStats.games.push({ ...currentGameStats, ...gameStats });

        return playerStats;
    });
}