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
    'ab',
    'battingOrder',
    'bb',
    'cs',
    'doubles',
    'gp',
    'hr',
    'k',
    'l',
    'name',
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
    'ab',
    'avg',
    'battingOrder',
    'h',
    'joined',
    'key',
    'obp',
    'ops',
    'photos',
    'profile',
    'rc',
    'slg',
    'status',
    'tb',
    'woba',
];

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
 * Combines winners and losers
 * @return {Array} list of updated player stats
 */
export function filterPlayerStats(gameData) {
    const winners = JSON.parse(gameData.winners);
    const losers = JSON.parse(gameData.losers);
    const gamePlayers = winners.players.concat(losers.players);

    return updateEntries(gamePlayers);
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
        player.w = winner ? '1' : '0';
        player.l = winner ? '0' : '1';
        if (isTie) {
            player.w = '0';
            player.l = '0';
        }
        player.gp = '1';
        return player;
    });
}

/**
 * GAMESTATS Adaptor to combine data from meetup and current game stats
 * @param {Array} meetupData - data from meetup api
 * @param {Array} currentStats - all player stats from current game
 * @return {Object} currentGameStats
 */
export function mergeGameStats(meetupData, w, l) {
    const currentGameStats = omit(meetupData, ['players']);
    const isTie = getTeamRunsScored(w) === getTeamRunsScored(l);

    const winningTeam = addDerivedStats(w, isTie, true);
    const losingTeam = addDerivedStats(l, isTie, false);

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
}

/**
 * PLAYERSTATS Adaptor to combine data from meetup and current game stats
 * @param {Array} currentGame - data from meetup api
 * @param {Array} w - winners
 * @param {Array} l - losers
 * @return {Array} list of players and their stats
 */
export function mergePlayerStats(currentGame, w, l) {
    const currentGameStats = pick(currentGame, gameProperties);
    const isTie = getTeamRunsScored(w) === getTeamRunsScored(l);
    const winningTeam = addDerivedStats(w, isTie, true);
    const winners = createPlayerGameLog(winningTeam, currentGameStats);
    const losingTeam = addDerivedStats(l, isTie);
    const losers = createPlayerGameLog(losingTeam, currentGameStats);

    return winners.concat(losers);
}

/**
 * Stringify values and combine into one object
 * @param {*} player
 * @param {*} derivedStats
 * @return {Object}
 */
function combineDerivedStats(player, derivedStats) {
    const derivedWithStrings = {};
    Object.keys(derivedStats).forEach((key) => {
        derivedWithStrings[key] = String(derivedStats[key]);
    });

    return Object.assign(pick(player, stats), derivedWithStrings);
}

/**
 * Calculate cumulative stats from current game and the running total
 * This can be used generically after filtering data from database
 * @return {Object} updated stats for an individual player
 */
function mergePlayerStatsForView(existingStats = {}, currentStats) {
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
        ab: atBats,
        battingOrder: updatedStats.battingOrder,
        h: hits,
        obp: onBasePercentage,
        ops: onBasePlusSlugging,
        rc: runsCreated,
        slg: slugging,
        tb: totalBases,
        woba: weightedOnBaseAverage,
        avg,
    });
}

/**
 * Build up master list with updated player stats
 * @return {Map} map of player stats
 */
function updateEntries(gamePlayers) {
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
            sac: Number(player.sac),
        };

        if (masterList.has(player.name)) {
            const existingStats = masterList.get(player.name);
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

            playerStats.meetupId = player.meetupId;
            playerStats.photos = player.photos;
            playerStats.profile = player.profile;

            masterList.set(playerStats.name, playerStats);
        }
    });

    return masterList;
}

/**
 * Create a game log for each player
 * @param {*} players
 * @param {*} currentGameStats
 */
function createPlayerGameLog(players, currentGameStats) {
    return players.map((player) => {
        const gameStats = pick(player, stats);
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
        playerStats.games.push({ ...gameStats, ...currentGameStats });
        playerStats.games = playerStats.games;
        return playerStats;
    });
}
