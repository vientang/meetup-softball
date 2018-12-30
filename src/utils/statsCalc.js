import get from "lodash/get";
import transform from "lodash/transform";

/**
 * GAMESTATS Adaptor to combine data from meetup and current game stats
 * @param {Array} meetupData - data from meetup api
 * @param {Array} currentStats - all player stats from current game
 * @return {Object} currentGameStats
 */
const mergeGameStats = (meetupData, currentStats) => {
    const currentGameStats = {};
    const midPoint = Math.floor(currentStats.length / 2);

    if (meetupData) {
        currentGameStats.meetupId = meetupData.meetupId;
        currentGameStats.date = meetupData.local_date;
        currentGameStats.gameId = meetupData.name.split(' ')[1]; // "Game 235 @???";
        currentGameStats.year = meetupData.local_date.slice(0, 4);
        currentGameStats.month = meetupData.local_date.slice(5, 7);
        currentGameStats.name = meetupData.venue.name;
        currentGameStats.fieldName = meetupData.venue.name;
        currentGameStats.tournamentName = meetupData.tournamentName;
    }
    
	// currentGameStats.tournamentName = currentStats.tournamentName;
    const winners = {
        name: 'Winners', // swap with data from the admin
        homeField: true, // swap with data from the admin 
        players: currentStats.slice(0, midPoint),
    };
    const losers = {
        name: 'Losers', // swap with data from the admin
        homeField: false, // swap with data from the admin
        players: currentStats.slice(midPoint),
    };
    
    currentGameStats.winners = JSON.stringify(winners);
    currentGameStats.losers = JSON.stringify(losers);

	return currentGameStats;
}

/**
 * PLAYERSTATS Adaptor to merge current player stats into existing player stats
 * @param {Array} existingStats - existing player stats from meetup api
 * @param {Array} currentStats - player stats from current game
 * @return {Object} updatedPlayerStats
 */
const mergePlayerStats = (existingStats, currentStats) => {
    const currentPlayers = mergeAllCurrentPlayers(currentStats);
    
    const ignoreKeystoTransform = ['id', 'meetupId', 'name', 'avg', 'h', 'ab', 'tb', 'rc'];

    return currentPlayers.map((player, i) => {
        const hits = getHits(Number(player["1b"]), Number(player["2b"]), Number(player["3b"]), Number(player.hr)) + Number(get(existingStats[i], 'h'));
        const atBats = getAtBats(hits, Number(player["o"])) + Number(get(existingStats[i], 'ab'));
        const totalBases = getTotalBases(Number(player["1b"]), Number(player["2b"]), Number(player["3b"]), Number(player.hr)) + Number(get(existingStats[i], 'tb'));
        const bb = Number(player.bb) + Number(existingStats[i].bb);
        const sb = Number(player.sb) + Number(existingStats[i].sb);
        const cs = Number(player.cs) + Number(existingStats[i].cs);
        const runsCreated = getRunsCreated(hits, bb, cs, totalBases, sb, atBats);
        const avg = getAverage(hits, atBats);
        
        const onBasePercentage = getonBasePercentage(hits, Number(player.bb), atBats, Number(player.sac));
        const slugging = getSlugging(totalBases, atBats);
        const onBasePlusSlugging = getOPS(onBasePercentage, slugging);
        const weightedOnBaseAverage = getWOBA(Number(player.bb), Number(player["1b"]), Number(player["2b"]), Number(player["3b"]), Number(player.hr), atBats, Number(player.sac));
        
        const updatedStats = transform(player, function(result, value, key) {
            if (ignoreKeystoTransform.includes(key)) {
                result[key] = value;
            } else {
                result[key] = (Number(value) + Number(existingStats[i][key])).toString();
            }
        }, {});
        
        updatedStats.h = hits.toString();
        updatedStats.ab = atBats.toString();
        updatedStats.tb = totalBases.toString();
        updatedStats.rc = runsCreated.toString();
        updatedStats.avg = avg.toString();
        updatedStats.obp = onBasePercentage.toString();
        updatedStats.slg = slugging.toString();
        updatedStats.ops = onBasePlusSlugging.toString();
        updatedStats.woba = weightedOnBaseAverage.toString();

        return updatedStats;
    });
}

/**
 * Merge all players, winners and losers, into one list
 * @param {Object} gameStats
 * @return {Array} winners and losers
 */
const mergeAllCurrentPlayers = (gameStats) => {
    const gameWinners = JSON.parse(gameStats.winners);
    const gameLosers = JSON.parse(gameStats.losers);
    
    const winners = addDefaultStats(gameWinners.players, true);    
    const losers = addDefaultStats(gameLosers.players, false);
    
    return winners.concat(losers);
}

/**
 * Add stats that can be derived from playing a game
 * Admins do not need to enter these
 * @param {Array} players
 * @param {Boolean} winner
 * @return {Array}
 */
const addDefaultStats = (players, winner) => players.map((player) => {
    player.w = winner ? '1' : '0';
    player.l = winner ? '0' : '1';
    player.gp = '1';
    return player;
});

/**
 * LIST OF PLAYER STATS
 * HOLDS ALL OF THE RESOLVED STATS BASED ON A SPECIFIC FILTER
 */
const masterList = new Map();
const clearMasterList = () => {    
    masterList.clear();
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
 * Build up master list with updated player stats
 * @return {Map} map of player stats
 */
const updateEntries = (gamePlayers, allPlayers) => {
    gamePlayers.forEach((playerStats) => {
        if (masterList.has(playerStats.name)) {
            const existingStats = allPlayers.find(player => player.name === playerStats.name);
            const newStats = mergePlayerStatsForView(existingStats, playerStats);
            masterList.set(playerStats.name, newStats);
        } else {
            masterList.set(playerStats.name, playerStats);
        }
    });
    return masterList;
}

/**
 * Calculate cumulative stats from current game and the running total
 * This can be used generically after filtering data from database
 * @return {Object} updated stats for an individual player
 */
const mergePlayerStatsForView = (existingStats, currentStats) => {
    const ignoreKeystoTransform = ['id', 'meetupId', 'name', 'avg', 'h', 'ab', 'tb', 'rc', 'key', 'obp', 'ops', 'slg', 'woba'];

    // only add existing stats if it's there
    // otherwise, we'll get NaN
    let hits = getHits(Number(currentStats["1b"]), Number(currentStats["2b"]), Number(currentStats["3b"]), Number(currentStats.hr));
    if (existingStats.h) {
        hits += Number(existingStats.h);
    }

    let atBats = getAtBats(hits, Number(currentStats["o"]));    
    if (existingStats.ab && Number(get(existingStats, 'ab')) > 0) {        
        atBats += Number(get(existingStats, 'ab'));
    }
    
    // rounded to the third digit
    // slice off the leading zero if necessary
    let avg = atBats > 0 ? getAverage(hits, atBats) : getAverage(hits, 1);
    avg = avg.toFixed(3);
    if (avg[0] === "0") {
        avg = avg.slice(1);
    }
    
    let totalBases = getTotalBases(Number(currentStats["1b"]), Number(currentStats["2b"]), Number(currentStats["3b"]), Number(currentStats.hr));
    if (Number(get(existingStats, 'tb'))) {
        totalBases += Number(get(existingStats, 'tb'));
    }

    const bb = Number(currentStats.bb) + Number(existingStats.bb);
    const sb = Number(currentStats.sb) + Number(existingStats.sb);
    const cs = Number(currentStats.cs) + Number(existingStats.cs);

    // total bases and atBats need to be greater than 0
    // otherwise we get NaN
    let runsCreated = 0;
    if (totalBases > 0 && atBats > 0) {
        runsCreated = getRunsCreated(hits, bb, cs, totalBases, sb, atBats);
    }

    const onBasePercentage = getonBasePercentage(hits, Number(currentStats.bb), atBats, Number(currentStats.sac));
    const slugging = getSlugging(totalBases, atBats);
    const onBasePlusSlugging = getOPS(onBasePercentage, slugging);
    const weightedOnBaseAverage = getWOBA(Number(currentStats.bb), Number(currentStats["1b"]), Number(currentStats["2b"]), Number(currentStats["3b"]), Number(currentStats.hr), atBats, Number(currentStats.sac));
    
    const updatedStats = transform(currentStats, function(result, value, key) {
        if (ignoreKeystoTransform.includes(key)) {
            result[key] = value;
        } else {
            result[key] = (Number(value) + Number(existingStats[key])).toString();
        }
    }, {});
    
    updatedStats.h = hits.toString();
    updatedStats.ab = atBats.toString();
    updatedStats.tb = totalBases.toString();
    updatedStats.rc = runsCreated.toString();
    updatedStats.avg = avg;
    updatedStats.obp = onBasePercentage.toString();
    updatedStats.slg = slugging.toString();
    updatedStats.ops = onBasePlusSlugging.toString();
    updatedStats.woba = weightedOnBaseAverage.toString();

    return updatedStats;
}

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

export default { 
    mergePlayerStats, 
    mergeGameStats,
    mergeAllCurrentPlayers, 
    getHits,
    getAtBats, 
    getTotalBases, 
    getRunsCreated,
    getAverage,
    getonBasePercentage,
    getSlugging,
    getOPS,
    getWOBA,
    filterPlayerStats,
    clearMasterList,
};