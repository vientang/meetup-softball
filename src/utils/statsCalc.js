import omit from 'lodash/omit';
import pick from 'lodash/pick';
import { gameProperties, playerProfileKeys } from './constants';

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

/**
 * Merge player profile properties with calculated stat totals
 * @param {Object} existingStats
 * @param {Object} currentStats
 * @return {Object}
 */
export function mergeExistingPlayerStats(existingStats = {}, currentStats = {}) {
    const playerData = pick(existingStats, playerProfileKeys);
    const total = calculateTotals(existingStats, currentStats);

    return { ...playerData, ...total };
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
 * Calculate cumulative stats from the current game and the running total
 * @param {Object} existingStats
 * @param {Object} currentStats
 * @return {Object} updated stats for an individual player
 */
export function calculateTotals(existingStats = {}, currentStats = {}) {
    const { bb, cs, singles, doubles, sb, triples, hr, o, sac } = currentStats;

    // counting stats
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

    // rate stats
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
 * Functions to calculate stats
 * check to ensure denominator isn't 0 before dividing
 */
export function getHits(singles, doubles, triples, homeRuns) {
    return singles + doubles + triples + homeRuns;
}

export function getAtBats(hits, outs) {
    return hits + outs;
}

export function getTotalBases(singles, doubles, triples, homeRuns) {
    return singles + doubles * 2 + triples * 3 + homeRuns * 4;
}

export function getRunsCreated(hits, walks, caughtStealing, totalBases, stolenBases, atBats) {
    if (atBats + walks === 0) {
        return 0;
    }
    const result =
        ((hits + walks - caughtStealing) * (totalBases + stolenBases * 0.55)) / (atBats + walks);
    return Number(`${Math.round(`${result}e+3`)}e-3`);
}

export function getAverage(hits, atBats) {
    if (atBats === 0) {
        return 0;
    }
    const avg = hits / atBats;
    return Number(`${Math.round(`${avg}e+3`)}e-3`);
}

export function getOnBasePercentage(hits, walks, atBats, sacrifices) {
    if (atBats + walks + sacrifices > 0) {
        const result = Number(`
      ${(hits + walks) / (atBats + walks + sacrifices)}e+3
    `);
        return Number(`${Math.round(result)}e-3`);
    }
    return 0;
}

export function getSlugging(totalBases, atBats) {
    if (atBats === 0) {
        return 0;
    }
    const result = Number(`${totalBases / atBats}e+3`);
    return Number(`${Math.round(result)}e-3`);
}

export function getOPS(onBase, slugging) {
    return onBase + slugging;
}

export function getWOBA(walks, singles, doubles, triples, homeRuns, atBats, sacrifices) {
    if (atBats + walks + sacrifices === 0) {
        return 0;
    }
    const calcHits =
        0.69 * walks + 0.888 * singles + 1.271 * doubles + 1.616 * triples + 2.101 * homeRuns;
    const plateApp = atBats + walks + sacrifices;
    return Number(`${Math.round(`${calcHits / plateApp}e+3`)}e-3`);
}

export function getTeamRunsScored(players) {
    return players.reduce((total, player) => {
        return total + Number(player.r);
    }, 0);
}

export function getTeamTotalHits(players) {
    return players.reduce((total, player) => {
        const { singles, doubles, triples, hr } = player;
        const sing = Number(singles) || 0;
        const doub = Number(doubles) || 0;
        const trip = Number(triples) || 0;
        const homeRuns = Number(hr) || 0;
        return total + getHits(sing, doub, trip, homeRuns);
    }, 0);
}

export function getOuts(ab, sac, hits) {
    return ab - sac - hits;
}
