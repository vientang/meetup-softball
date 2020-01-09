import pick from 'lodash/pick';
import { convertStringStatsToNumbers } from './helpers';

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

export function updateGamesPlayed(gp) {
    return Number(gp) + 1;
}

/**
 * Calculate total stats by specified key
 * @param {Object} values
 * @param {String} key
 */
export function calculateCareerStats(values, key) {
    const careerStats = {};
    Object.keys(values).forEach((val) => {
        if (values[val].length > 1) {
            values[val].forEach((game) => {
                if (careerStats[val]) {
                    careerStats[val] = calculateTotals(careerStats[val], game);
                } else {
                    careerStats[val] = game;
                }
            });
        } else {
            careerStats[val] = { ...values[val][0] };
        }
        careerStats[val].gp = values[val].length;
    });
    return Object.values(transformCareerStats(careerStats, key));
}

/**
 * Maps stats by type
 * @param {Object} careerStats
 * @param {String} type
 */
export function transformCareerStats(careerStats, type) {
    return Object.keys(careerStats).map((key) => {
        const stats = careerStats[key];
        stats[type] = key;
        return stats;
    });
}

export function calculateCurrentStats(stats) {
    const {
        bb,
        cs,
        doubles,
        gp,
        k,
        l,
        hr,
        o,
        rbi,
        r,
        sac,
        sb,
        singles,
        triples,
        w,
    } = convertStringStatsToNumbers(stats);

    const hits = getHits(singles, doubles, triples, hr);
    const atBats = getAtBats(hits, o);
    const totalBases = getTotalBases(singles, doubles, triples, hr);
    const average = getAverage(hits, atBats);
    const onBasePercentage = getOnBasePercentage(hits, bb, atBats, sac);
    const slugging = getSlugging(totalBases, atBats);
    const runsCreated = getRunsCreated(hits, bb, cs, totalBases, sb, atBats);
    const onBaseSlugging = getOPS(onBasePercentage, slugging);
    const winsOba = getWOBA(bb, singles, doubles, triples, hr, atBats, sac);

    return {
        ab: atBats,
        avg: average,
        bb,
        cs,
        doubles,
        gp,
        h: hits,
        hr,
        k,
        l,
        o,
        obp: onBasePercentage,
        ops: onBaseSlugging,
        rbi,
        r,
        rc: runsCreated,
        sac,
        sb,
        singles,
        slg: slugging,
        tb: totalBases,
        triples,
        woba: winsOba,
        w,
    };
}

/**
 * Calculate cumulative stats from the current game and the running total
 * @param {Object} existingStats
 * @param {Object} currentStats
 * @return {Object} updated stats for an individual player
 */
export function calculateTotals(existingStats = {}, currentStats = {}) {
    const { bb, cs, gp, k, l, r, rbi, singles, doubles, sb, triples, hr, o, sac, w } = currentStats;
    if (!existingStats || !Object.keys(existingStats).length) {
        return calculateCurrentStats(currentStats);
    }

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
        gp: addStat(gp, existingStats.gp),
        h: totalHits,
        hr: totalHr,
        k: addStat(k, existingStats.k),
        l: addStat(l, existingStats.l),
        o: totalOuts,
        rbi: addStat(rbi, existingStats.rbi),
        r: addStat(r, existingStats.r),
        sac: totalSacs,
        sb: totalStls,
        singles: totalSingles,
        tb: totalTb,
        triples: totalTriples,
        w: addStat(w, existingStats.w),
        obp,
        ops,
        rc,
        slg,
        woba,
    };
}

export function addStat(currentStat = 0, existingStat = 0) {
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
