import { get } from "lodash";

/**
 * Adaptor to combine data from meetup and current game stats
 * @param {Array} meetupData - data from meetup api
 * @param {Array} currentStats - all game stats from current game
 * @return {Object} currentGameStats
 */
const mergeGameStats = (meetupData, currentStats) => {
	const currentGameStats = {};
	currentGameStats.gameId = meetupData.name.split(' ')[1]; // "Game 235 @???";
	currentGameStats.year = meetupData.local_date.slice(0, 4);
	currentGameStats.month = meetupData.local_date.slice(5, 7);
	currentGameStats.fieldName = meetupData.venue.name;
	currentGameStats.tournamentName = currentStats.tournamentName;
	currentGameStats.winners = currentStats.winners;
	currentGameStats.losers = currentStats.losers;

	return currentGameStats;
}

/**
 * Adaptor to merge current player stats into existing player stats
 * @param {Array} existingStats - existing player stats from meetup api
 * @param {Array} currentStats - player stats from current game
 * @return {Object} updatedPlayerStats
 */
const mergePlayerStats = (existingStats, currentStats) => {
    //creating new array with map method, which adds or updates data with element.(item)
    const updatedData = enteredData.map(element => {
        const hits = getHits(Number(element["1b"]), Number(element["2b"]), Number(element["3b"]), Number(element.hr));
        element.h = hits.toString();
        const atBats = getAtBats(hits, Number(element.o));
        element.ab = atBats.toString();
        const totalBases = getTotalBases(Number(element["1b"]), Number(element["2b"]), Number(element["3b"]), Number(element.hr));
        element.tb = totalBases.toString();
        const runsCreated = getRunsCreated(hits, Number(element.bb), Number(element.cs), totalBases, Number(element.sb), atBats);
        element.rc = runsCreated.toString();
        const average = getAverage(hits, atBats);
        element.avg = average.toString();
        const onBasePercentage = getonBasePercentage(hits, Number(element.bb), atBats, Number(element.sac));
        element.obp = onBasePercentage.toString();
        const slugging = getSlugging(totalBases, atBats);
        element.slg = slugging.toString();
        const onBasePlusSlugging = getOPS(onBasePercentage, slugging);
        element.ops = onBasePlusSlugging.toString();
        const weightedOnBaseAverage = getWOBA(Number(element.bb), Number(element["1b"]), Number(element["2b"]), Number(element["3b"]), Number(element.hr), atBats, Number(element.sac));
        element.woba = weightedOnBaseAverage.toString();
        
        return element;
    });
    return updatedData;
}

//Derive hits from user entered data to use in other functions

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
    return (((hits + walks - caughtStealing) * (totalBases + (stolenBases * .55)) / (atBats + walks)));
}

const getAverage = (hits, atBats) => {
    return (hits / atBats);
}

const getonBasePercentage = (hits, walks, atBats, sacrifices) => {
    return ((hits + walks) / (atBats + walks + sacrifices));
}

const getSlugging = (totalBases, atBats) => {
    return (totalBases / atBats);
}

const getOPS = (onBase, slugging) => {
    return (onBase + slugging);
}

const getWOBA = (walks, singles, doubles, triples, homeRuns, atBats, sacrifices) => {
    return ((.69 * walks + .888 * singles + 1.271 * doubles + 1.616 * triples + 2.101 * homeRuns) / (atBats + walks + sacrifices));
}

export { 
    mergePlayerStats, 
    mergeGameStats, 
    gethits, 
    getAtBats, 
    getTotalBases, 
    getRunsCreated,
    getAverage,
    getonBasePercentage,
    getSlugging,
    getOPS,
    getWOBA,
};
