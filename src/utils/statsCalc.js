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
    //check to ensure denominator isn't 0 before dividing
    if (atBats + walks === 0) {
        return 0;
    }
    return +(Math.round((((hits + walks - caughtStealing) * (totalBases + (stolenBases * .55)) / (atBats + walks))) + "e+3") + "e-3");
}

const getAverage = (hits, atBats) => {
    if (atBats === 0){
        return .000;
    }
    
    return +(Math.round((hits / atBats) + "e+3") + "e-3"); 
}

const getOnBasePercentage = (hits, walks, atBats, sacrifices) => {
    if (atBats + walks + sacrifices > 0) {
        return +(Math.round((hits + walks) / (atBats + walks + sacrifices) + "e+3") + "e-3");
    }
    else {
        return .000;
    }
}

const getSlugging = (totalBases, atBats) => {
    if (atBats === 0){
        return .000;
    }
    return +(Math.round((totalBases / atBats) + "e+3") + "e-3");
}

const getOPS = (onBase, slugging) => {
    return (onBase + slugging);
}

const getWOBA = (walks, singles, doubles, triples, homeRuns, atBats, sacrifices) => {
    if (atBats + walks + sacrifices === 0){
        return .000;
    }
    return +(Math.round(((.69 * walks + .888 * singles + 1.271 * doubles + 1.616 * triples + 2.101 * homeRuns) / (atBats + walks + sacrifices)) + "e+3") + "e-3");
        
}

export default { 
    getHits,
    getAtBats, 
    getTotalBases, 
    getRunsCreated,
    getAverage,
    getOnBasePercentage,
    getSlugging,
    getOPS,
    getWOBA,
};