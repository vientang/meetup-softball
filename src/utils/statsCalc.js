import get from "lodash/get";
import transform from "lodash/transform";

/**
 * GAMESTATS Adaptor to combine data from meetup and current game stats
 * @param {Array} meetupData - data from meetup api
 * @param {Array} currentStats - all game stats from current game
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
	currentGameStats.winners = JSON.stringify(currentStats.slice(0, midPoint));
	currentGameStats.losers = JSON.stringify(currentStats.slice(midPoint));

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
    const winners = addDefaultStats(gameStats.winners.players, true);
    const losers = addDefaultStats(gameStats.losers.players, false);
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
    player.wins = winner ? '1' : '0';
    player.losses = winner ? '0' : '1';
    player.gamesPlayed = '1';
    return player;
});

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