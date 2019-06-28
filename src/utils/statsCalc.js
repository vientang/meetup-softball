/**
 * Functions to calculate stats
 * check to ensure denominator isn't 0 before dividing
 */
const getHits = (singles, doubles, triples, homeRuns) => {
    return singles + doubles + triples + homeRuns;
};

const getAtBats = (hits, outs) => {
    return hits + outs;
};

const getTotalBases = (singles, doubles, triples, homeRuns) => {
    return singles + doubles * 2 + triples * 3 + homeRuns * 4;
};

const getRunsCreated = (hits, walks, caughtStealing, totalBases, stolenBases, atBats) => {
    if (atBats + walks === 0) {
        return 0;
    }
    const result =
        ((hits + walks - caughtStealing) * (totalBases + stolenBases * 0.55)) / (atBats + walks);
    return Number(`${Math.round(`${result}e+3`)}e-3`);
};

const getAverage = (hits, atBats) => {
    if (atBats === 0) {
        return 0;
    }
    const avg = hits / atBats;
    return Number(`${Math.round(`${avg}e+3`)}e-3`);
};

const getOnBasePercentage = (hits, walks, atBats, sacrifices) => {
    if (atBats + walks + sacrifices > 0) {
        const result = Number(`
      ${(hits + walks) / (atBats + walks + sacrifices)}e+3
    `);
        return Number(`${Math.round(result)}e-3`);
    }
    return 0;
};

const getSlugging = (totalBases, atBats) => {
    if (atBats === 0) {
        return 0;
    }
    const result = Number(`${totalBases / atBats}e+3`);
    return Number(`${Math.round(result)}e-3`);
};

const getOPS = (onBase, slugging) => {
    return onBase + slugging;
};

const getWOBA = (walks, singles, doubles, triples, homeRuns, atBats, sacrifices) => {
    if (atBats + walks + sacrifices === 0) {
        return 0;
    }
    const calcHits =
        0.69 * walks + 0.888 * singles + 1.271 * doubles + 1.616 * triples + 2.101 * homeRuns;
    const plateApp = atBats + walks + sacrifices;
    return Number(`${Math.round(`${calcHits / plateApp}e+3`)}e-3`);
};

const getTeamRunsScored = (players) => {
    return players.reduce((total, player) => {
        return total + Number(player.r);
    }, 0);
};

const getTeamTotalHits = (players) => {
    return players.reduce((total, player) => {
        const { singles, doubles, triples, hr } = player;
        const sing = Number(singles) || 0;
        const doub = Number(doubles) || 0;
        const trip = Number(triples) || 0;
        const homeRuns = Number(hr) || 0;
        return total + getHits(sing, doub, trip, homeRuns);
    }, 0);
};

const getOuts = (ab, sac, hits) => {
    return ab - sac - hits;
};

export default {
    getAtBats,
    getAverage,
    getHits,
    getOnBasePercentage,
    getOPS,
    getOuts,
    getRunsCreated,
    getSlugging,
    getTeamRunsScored,
    getTeamTotalHits,
    getTotalBases,
    getWOBA,
};
