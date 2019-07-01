/* eslint-disable no-restricted-syntax, no-await-in-loop */
import fetchJsonp from 'fetch-jsonp';
import statsCalc from './statsCalc';
import { convertStringStatsToNumbers } from './helpers';

const { getHits, getOuts } = statsCalc;

const legacyPlayerList = new Map();
/**
 * Convert legacy data structure to adapt to PlayerStats schema
 * @param {Array}
 * @return {Array}
 */
export async function convertLegacyPlayerData(data) {  
    legacyPlayerList.clear();

    for (const [i, datum] of data.entries()) {
        const legacyPlayerId = datum.meetupId.toString();
        const legacyPlayer = legacyPlayerList.get(legacyPlayerId);

        // format game data and calculate stats
        const gameData = buildGameData(datum, data[i - 1]);
        const gameStats = buildGameStats(datum, legacyPlayer);

        if (legacyPlayer) {
            legacyPlayer.games.push({ ...gameData, ...gameStats });
        } else {
            const playerData = await getPlayerDataFromMeetup(datum.meetupId);
            if (playerData.data.errors) {
                continue;
            }
            const player = await transformMeetupData({
                ...playerData.data,
                meetupId: datum.meetupId,
                gender: datum.gender,
            });

            try {
                player.games = [];
                player.games.push({ ...gameData, ...gameStats });
                legacyPlayerList.set(legacyPlayerId, player);
            } catch (error) {
                throw new Error(error);
            }
        }
    }
    
    return legacyPlayerList;
}

const legacyGameList = new Map();
export function convertLegacyGameData(data) {      
    legacyGameList.clear();

    for (const [i, datum] of data.entries()) {
        // get player data && delete the games array
        const legacyPlayerId = datum.meetupId.toString();
        const playerData = getPlayerDataForGameStats(legacyPlayerId);
        if (!playerData) {
            continue;
        }

        // get player stats && add derived stats
        const playerStats = getPlayerStatsWithDerivedStats(datum);
        const { singles, doubles, triples, hr, r } = playerStats;
        const hits = getHits(singles, doubles, triples, hr);
        // combine data and stats
        const player = { ...playerData, ...playerStats };

        // set up game data properties - date, field, time, gameId, etc.
        const gameData = buildGameData(datum, data[i - 1]);
        const legacyGame = legacyGameList.get(gameData.gameId);
        const isWinner = isOnWinningTeam(datum);
        
        if (legacyGame) {
            if (isWinner) {
                legacyGame.winners.runsScored += r;
                legacyGame.winners.totalHits += hits;
                legacyGame.winners.players.push(player);
            } else {
                legacyGame.losers.runsScored += r;
                legacyGame.losers.totalHits += hits;
                legacyGame.losers.players.push(player);
            }
        } else {
            gameData.losers = {
                name: 'Losers',
                players: [],
                runsScored: 0,
                totalHits: 0,
            };
            gameData.winners = {
                name: 'Winners',
                players: [],
                runsScored: 0,
                totalHits: 0,
            };

            if (isWinner) {
                gameData.winners.runsScored = r;
                gameData.winners.totalHits = hits;
                gameData.winners.players.push(player);
            } else {
                gameData.losers.runsScored = r;
                gameData.losers.totalHits = hits;
                gameData.losers.players.push(player);
            }

            legacyGameList.set(gameData.gameId, gameData);
        }
    }

    return legacyGameList;
}

const currentGameData = new Map();
function buildGameData(data = {}, prevEntry) {
    const gameId = getGameId(data, prevEntry);
    const gameData = {
        date: new Date(data.date).toString().slice(0, 15), // Wed Nov 13 2013
        field: data.field,
        time: data.time,
        timeStamp: Date.parse(`${data.date} ${data.time}`).toString(),
        gameId,
    };

    const gameDate = currentGameData.get('date');

    if (gameDate === data.date) {
        // on current game
        gameData.name = currentGameData.get('name');
        gameData.year = currentGameData.get('year');
        gameData.month = currentGameData.get('month');
    } else {
        // on a different game
        currentGameData.clear();

        const name = `Game ${gameId} @ ${data.field}`;
        const year = parseCurrentYear(data.date);
        const month = parseCurrentMonth(data.date);

        gameData.name = name;
        gameData.year = year;
        gameData.month = month;

        // date is used to match against current date
        // to avoid parsing dates and logic for getting name
        currentGameData.set('date', data.date);
        currentGameData.set('name', name);
        currentGameData.set('year', year);
        currentGameData.set('month', month);
    }

    return withUntrackedGameData(gameData);
}

function buildGameStats(data, legacyPlayer) {
    const { TEAM_1, TEAM_2, team } = data;
    const stats = convertStringStatsToNumbers(data);
    const { ab, singles, doubles, triples, hr, sac } = stats;

    const hits = getHits(singles, doubles, triples, hr);
    stats.o = getOuts(ab, sac, hits);
    stats.gp = legacyPlayer ? legacyPlayer.games.length + 1 : 1;
    stats.w = TEAM_1 === team ? 1 : 0;
    stats.l = TEAM_2 === team ? 1 : 0;

    return withUntrackedStats(stats);
}

/**
* Persist gameId's in localStorage - derive from team numbers
* @param {Object} data
* @param {String} prevEntry use previous gameId to build the next gameId
* @return {Number}
*/
function getGameId(data, prevEntry) {
    const { date, time } = data;
    const key = `${date}-${time}`;
    let gameIds = localStorage.getItem('gameIds');

    // first entry will be undefined
    if (!gameIds) {
        const gameNumbers = {
            [key]: 1,
        };
        localStorage.setItem('gameIds', JSON.stringify(gameNumbers));
        return 1;
    }

    // gameIds exists in localStorage
    gameIds = JSON.parse(gameIds);
    if (gameIds[key]) {
        return gameIds[key];
    }

    // new gameId
    // should only be here when iterating over players, not games
    return gameIds[`${prevEntry.date}-${prevEntry.time}`] + 1;
}

/**
 * Get player data from legacyPlayerList map
 * Then remove games - not needed for GameStats
 * @param {String} legacyPlayerId
 */
function getPlayerDataForGameStats(legacyPlayerId) {
    const playerData = legacyPlayerList.get(legacyPlayerId);

    if (!playerData) {
        return null;
    }

    const playerDataForGameStats = { ...playerData };
    delete playerDataForGameStats.games;

    return playerDataForGameStats;
}

function getPlayerStatsWithDerivedStats(datum, isWinner) {
    const playerStats = convertStringStatsToNumbers(datum);
    const { ab, singles, doubles, triples, hr, sac } = playerStats;
    const hits = getHits(singles, doubles, triples, hr);
    playerStats.o = getOuts(ab, sac, hits);
    playerStats.gp = 1;
    playerStats.w = isWinner ? 1 : 0;
    playerStats.l = isWinner ? 0 : 1;

    return withUntrackedStats(playerStats);
}

function parseCurrentYear(date) {
    return date.split('/')[2];
}

function parseCurrentMonth(date) {
    return date.split('/')[0];
}

async function getPlayerDataFromMeetup(meetupId) {
    const playerData = await fetchJsonp(
        `${process.env.PLAYER_URL}${meetupId}?&sign=true&photo-host=public`,
    )
        .then((response) => response.json())
        .then((playerResult) => playerResult)
        .catch((error) => {
            throw new Error(error);
        });
    return playerData;
}

function transformMeetupData(data) {
    const { name, joined, gender, group_profile, is_pro_admin, meetupId, photo, status } = data;

    return {
        admin: is_pro_admin,
        gender: getGender(gender),
        joined: joined.toString(),
        meetupId: meetupId.toString(),
        photos: JSON.stringify(photo),
        profile: JSON.stringify(group_profile),
        name,
        status,
    };
}

/**
 * TEAM_1 is an identifier
 * team is the team id that the player was on
 * @param {Object} player
 */
function isOnWinningTeam(player) {
    const { TEAM_1, team } = player;
    return TEAM_1 === team;
}

/**
 * Legacy data labels genders as 1 and 2, who would've thought?
 * @param {Number}
 * @return {String}
 */
function getGender(gender) {
    if (!gender) {
        return 'n/a';
    }
    return gender === 1 ? 'm' : 'f';
}

/**
 * Set time, timeStamp, tournamentName, lat and lon to null
 */
function withUntrackedGameData(gameData) {
    const untracked = {
        lat: null,
        lon: null,
        meetupId: null,
        rsvps: null,
        tournamentName: null,
        waitListCount: null,
    };
    return { ...untracked, ...gameData };
}

/**
 * Set previously untracked stats to null
 */
function withUntrackedStats(stats) {
    const untracked = {
        battingOrder: null,
        cs: null,
    };
    return { ...untracked, ...stats };
}
