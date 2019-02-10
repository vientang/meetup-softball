import get from 'lodash/get';
import transform from 'lodash/transform';
import { statsCalc } from '../utils';

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
    gamePlayers.forEach((player) => {
        const stats = {
            first: Number(player['1b']),
            second: Number(player['2b']),
            third: Number(player['3b']),
            hr: Number(player.hr),
            o: Number(player.o),
            bb: Number(player.bb),
            cs: Number(player.cs),
            sb: Number(player.sb),
        };

        if (masterList.has(player.name)) {
            const existingStats = allPlayers.find(
                (prevPlayerStat) => prevPlayerStat.name === player.name,
            );
            const newStats = mergePlayerStatsForView(existingStats, player);
            masterList.set(player.name, newStats);
        } else {
            const { bb, cs, first, second, sb, third, hr, o, sac } = stats;

            const h = statsCalc.getHits(first, second, third, hr);
            const ab = statsCalc.getAtBats(h, o);
            const avg = statsCalc.getAverage(h, ab);
            const tb = statsCalc.getTotalBases(first, second, third, hr);
            const rc = statsCalc.getRunsCreated(h, bb, cs, tb, sb, ab);
            const obp = statsCalc.getOnBasePercentage(h, bb, ab, sac);
            const slg = statsCalc.getSlugging(tb, ab);
            const ops = statsCalc.getOPS(obp, slg);
            const woba = statsCalc.getWOBA(bb, first, second, third, hr, ab, sac);

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

            masterList.set(playerStats.name, playerStats);
        }
    });

    return masterList;
};

/**
 * Calculate cumulative stats from current game and the running total
 * This can be used generically after filtering data from database
 * @return {Object} updated stats for an individual player
 */
const mergePlayerStatsForView = (existingStats = {}, currentStats) => {
    const ignoreKeystoTransform = [
        'id',
        'meetupId',
        'name',
        'avg',
        'h',
        'ab',
        'tb',
        'rc',
        'key',
        'obp',
        'ops',
        'slg',
        'woba',
    ];
    const stats = {
        first: Number(currentStats['1b']),
        second: Number(currentStats['2b']),
        third: Number(currentStats['3b']),
        hr: Number(currentStats.hr),
        o: Number(currentStats.o),
        bb: Number(currentStats.bb),
        cs: Number(currentStats.cs),
        sb: Number(currentStats.sb),
        sac: Number(currentStats.sac),
    };

    const { bb, cs, first, second, sb, third, hr, o, sac } = stats;
    // only add existing stats if it's there
    // otherwise, we'll get NaN
    let hits = statsCalc.getHits(first, second, third, hr);
    if (existingStats.h) {
        hits += Number(existingStats.h);
    }

    let atBats = statsCalc.getAtBats(hits, o);
    if (existingStats.ab && Number(get(existingStats, 'ab')) > 0) {
        atBats += Number(get(existingStats, 'ab'));
    }

    const avg = statsCalc.getAverage(hits, atBats);

    let totalBases = statsCalc.getTotalBases(first, second, third, hr);
    if (Number(get(existingStats, 'tb'))) {
        totalBases += Number(get(existingStats, 'tb'));
    }

    const walks = bb + Number(existingStats.bb);
    const stolenBases = sb + Number(existingStats.sb);
    const caughtStealing = cs + Number(existingStats.cs);
    const runsCreated = statsCalc.getRunsCreated(
        hits,
        walks,
        caughtStealing,
        totalBases,
        stolenBases,
        atBats,
    );

    const onBasePercentage = statsCalc.getOnBasePercentage(hits, bb, atBats, sac);
    const slugging = statsCalc.getSlugging(totalBases, atBats);
    const onBasePlusSlugging = statsCalc.getOPS(onBasePercentage, slugging);
    const weightedOnBaseAverage = statsCalc.getWOBA(bb, first, second, third, hr, atBats, sac);

    let updatedStats = transform(
        currentStats,
        function(result, value, key) {
            if (ignoreKeystoTransform.includes(key)) {
                result[key] = value;
            } else {
                result[key] = existingStats[key]
                    ? (Number(value) + Number(existingStats[key])).toString()
                    : Number(value).toString();
            }
        },
        {},
    );

    return combineDerivedStats(updatedStats, {
        h: hits,
        ab: atBats,
        avg,
        tb: totalBases,
        rc: runsCreated,
        obp: onBasePercentage,
        slg: slugging,
        ops: onBasePlusSlugging,
        woba: weightedOnBaseAverage,
    });
};

/**
 * Stringify values and combine into one object
 * @param {*} adminStats
 * @param {*} derivedStats
 * @return {Object}
 */
const combineDerivedStats = (adminStats, derivedStats) => {
    const derivedWithStrings = {};
    for (let key in derivedStats) {
        derivedWithStrings[key] = String(derivedStats[key]);
    }
    return Object.assign(adminStats, derivedWithStrings);
};

/**
 * Add stats that can be derived from playing a game
 * Admins do not need to enter these
 * @param {Array} players
 * @param {Boolean} winner
 * @return {Array}
 */
const addDerivedStats = (players, winner) =>
    players.map((player) => {
        player.w = winner ? '1' : '0';
        player.l = winner ? '0' : '1';
        player.gp = '1';
        return player;
    });

const updateMergedPlayerStats = (existingPlayerStats, w, l) => {
    const winners = addDerivedStats(w, true);
    const losers = addDerivedStats(l);
    const currentPlayerStats = winners.concat(losers);
    return mergeAndSavePlayerStats(existingPlayerStats, currentPlayerStats);
};

/**
 * GAMESTATS Adaptor to combine data from meetup and current game stats
 * @param {Array} meetupData - data from meetup api
 * @param {Array} currentStats - all player stats from current game
 * @return {Object} currentGameStats
 */
const mergeGameStats = (meetupData, w, l) => {
    const currentGameStats = {};
    const winningTeam = addDerivedStats(w, true);
    const losingTeam = addDerivedStats(l);

    if (meetupData) {
        currentGameStats.meetupId = meetupData.meetupId;
        currentGameStats.date = meetupData.date;
        currentGameStats.gameId = meetupData.gameId; // "Game 235 @???";
        currentGameStats.year = meetupData.year;
        currentGameStats.month = meetupData.month;
        currentGameStats.name = meetupData.name;
        currentGameStats.field = meetupData.field;
        currentGameStats.tournamentName = meetupData.tournamentName;
    }

    // currentGameStats.tournamentName = currentStats.tournamentName;
    const winners = {
        name: 'Winners', // swap with data from the admin
        homeField: true, // swap with data from the admin
        players: winningTeam,
    };
    const losers = {
        name: 'Losers', // swap with data from the admin
        homeField: false, // swap with data from the admin
        players: losingTeam,
    };

    currentGameStats.winners = JSON.stringify(winners);
    currentGameStats.losers = JSON.stringify(losers);

    return currentGameStats;
};

/**
 * PLAYERSTATS Adaptor to merge current player stats into existing player stats
 * @param {Array} existingStats - existing player stats from meetup api
 * @param {Array} currentStats - player stats from current game
 * @return {Object} updatedPlayerStats
 */
const mergeAndSavePlayerStats = (existingPlayerStats, currentPlayerStats) => {
    const ignoreKeystoTransform = ['id', 'meetupId', 'name', 'avg', 'h', 'ab', 'tb', 'rc'];

    return currentPlayerStats.map((player, i) => {
        let hits = statsCalc.getHits(
            Number(player.singles),
            Number(player.doubles),
            Number(player.triples),
            Number(player.hr),
        );
        if (existingPlayerStats[i].h) {
            hits += Number(get(existingPlayerStats[i], 'h'));
        }

        let atBats = statsCalc.getAtBats(hits, Number(player['o']));
        if (existingPlayerStats[i].ab) {
            atBats += Number(get(existingPlayerStats[i], 'ab'));
        }

        let totalBases = statsCalc.getTotalBases(
            Number(player.singles),
            Number(player.doubles),
            Number(player.triples),
            Number(player.hr),
        );
        if (existingPlayerStats[i].tb) {
            totalBases += Number(get(existingPlayerStats[i], 'tb'));
        }

        let bb = Number(player.bb);
        if (existingPlayerStats[i].bb) {
            bb += Number(existingPlayerStats[i].bb);
        }

        let sb = Number(player.sb);
        if (existingPlayerStats[i].sb) {
            sb += Number(existingPlayerStats[i].sb);
        }

        let cs = Number(player.cs);
        if (existingPlayerStats[i].cs) {
            cs += Number(existingPlayerStats[i].cs);
        }

        let w = Number(player.w);
        if (existingPlayerStats[i].w) {
            w += Number(existingPlayerStats[i].w);
        }

        let l = Number(player.l);
        if (existingPlayerStats[i].l) {
            l += Number(existingPlayerStats[i].l);
        }

        let gp = Number(player.gp);
        if (existingPlayerStats[i].gp) {
            gp += Number(existingPlayerStats[i].gp);
        }

        const runsCreated = statsCalc.getRunsCreated(hits, bb, cs, totalBases, sb, atBats);
        const avg = statsCalc.getAverage(hits, atBats);

        const onBasePercentage = statsCalc.getOnBasePercentage(
            hits,
            Number(player.bb),
            atBats,
            Number(player.sac),
        );

        const slugging = statsCalc.getSlugging(totalBases, atBats);
        const onBasePlusSlugging = statsCalc.getOPS(onBasePercentage, slugging);
        const weightedOnBaseAverage = statsCalc.getWOBA(
            Number(player.bb),
            Number(player.singles),
            Number(player.doubles),
            Number(player.triples),
            Number(player.hr),
            atBats,
            Number(player.sac),
        );

        const updatedStats = transform(
            player,
            function(result, value, key) {
                if (ignoreKeystoTransform.includes(key)) {
                    result[key] = value;
                } else {
                    result[key] = Number(value);
                    if (existingPlayerStats[i][key]) {
                        result[key] += Number(existingPlayerStats[i][key]);
                    }
                    result[key] = result[key].toString();
                }
            },
            {},
        );

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
};

/**
 * Merge all players, winners and losers, into one list
 * @param {Object} gameStats
 * @return {Array} winners and losers
 */
const mergeAllCurrentPlayers = (gameStats) => {
    const gameWinners = JSON.parse(gameStats.winners);
    const gameLosers = JSON.parse(gameStats.losers);

    const winners = addDerivedStats(gameWinners.players, true);
    const losers = addDerivedStats(gameLosers.players, false);

    return winners.concat(losers);
};

export default {
    addDerivedStats,
    clearMasterList,
    filterPlayerStats,
    mergeAllCurrentPlayers,
    mergeAndSavePlayerStats,
    mergeGameStats,
    updateMergedPlayerStats,
};
