/**
 * Functions to calculate stats
 */
const getHits = (singles, doubles, triples, homeRuns) => {
   return (singles + doubles + triples + homeRuns);
}

const getAtBats = (hits, outs) => {
    return (hits + outs);
}

const getTotalBases = (singles, doubles, triples, homeRuns) => {
    return (singles + (doubles * 2) + (triples * 3) + (homeRuns * 4));
}

const getRunsCreated = (hits, walks, caughtStealing, totalBases, stolenBases, atBats) => {
    return totalBases > 0 && atBats > 0 
        ? (((hits + walks - caughtStealing) * (totalBases + (stolenBases * .55)) / (atBats + walks))) 
        : 0;
}

const getAverage = (hits, atBats) => {
    let average = atBats > 0 ? hits / atBats : hits / 1;
    
    // rounded to the third digit
    average = average.toFixed(3);
    
    // slice off the leading zero if necessary
    if (average[0] === "0") {
        average = average.slice(1);
    }

    return average;
}

const getonBasePercentage = (hits, walks, atBats, sacrifices) => {
    const denominator = atBats + walks + sacrifices;
    return denominator > 0 ? ((hits + walks) / denominator) : ((hits + walks) / 1);
}

const getSlugging = (totalBases, atBats) => {
    return atBats > 0 ? (totalBases / atBats) : (totalBases / 1).toFixed(3);
}

const getOPS = (onBase, slugging) => {
    return (onBase + slugging);
}

const getWOBA = (walks, singles, doubles, triples, homeRuns, atBats, sacrifices) => {
    const denominator = atBats + walks + sacrifices;
    return denominator > 0
        ? ((.69 * walks + .888 * singles + 1.271 * doubles + 1.616 * triples + 2.101 * homeRuns) / denominator).toFixed(3)
        : ((.69 * walks + .888 * singles + 1.271 * doubles + 1.616 * triples + 2.101 * homeRuns) / 1).toFixed(3);
}

export default { 
    getHits,
    getAtBats, 
    getTotalBases, 
    getRunsCreated,
    getAverage,
    getonBasePercentage,
    getSlugging,
    getOPS,
    getWOBA,
};