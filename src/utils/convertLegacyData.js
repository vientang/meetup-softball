/* eslint-disable no-restricted-syntax, no-await-in-loop */
import fetchJsonp from 'fetch-jsonp';
import { getHits, getOuts } from './statsCalc';
import { convertStringStatsToNumbers } from './helpers';

const legacyPlayerList = new Map();
/**
 * Convert legacy data structure to adapt to PlayerStats schema
 * @param {Array}
 * @return {Array}
 */
export async function convertLegacyPlayerData(data) {
    legacyPlayerList.clear();
    // remove this when we're ready to migrate all legacy stats
    // in order to persist the running count of game id's
    localStorage.removeItem('gameIds');

    for (const [i, datum] of data.entries()) {
        const legacyPlayerId = datum.id.toString();
        const legacyPlayer = legacyPlayerList.get(legacyPlayerId);

        // format game data and calculate stats
        const gameData = buildGameData(datum, data[i - 1]);
        const gameStats = buildGameStats(datum, legacyPlayer);

        if (legacyPlayer) {
            legacyPlayer.games.push({ ...gameData, ...gameStats });
        } else {
            const playerData = await getPlayerDataFromMeetup(datum.id);
            if (playerData.data.errors) {
                continue;
            }
            const player = await transformMeetupData({
                ...playerData.data,
                id: datum.id,
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
        const legacyPlayerId = datum.id.toString();
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
    const stats = convertStringStatsToNumbers(data);
    const { ab, singles, doubles, triples, hr, sac } = stats;

    const hits = getHits(singles, doubles, triples, hr);
    stats.o = getOuts(ab, sac, hits);
    stats.gp = legacyPlayer ? legacyPlayer.games.length + 1 : 1;
    stats.w = isOnWinningTeam(data) ? 1 : 0;
    stats.l = !isOnWinningTeam(data) ? 1 : 0;

    return withUntrackedStats(stats);
}

/**
 * Persist gameId's in localStorage - derive from team numbers
 * @param {Object} data
 * @param {String} prevEntry use previous gameId to build the next gameId
 * @return {Number}
 */
function getGameId(data, prevEntry = {}) {
    const { date, time } = data;
    const key = `${date}-${time}`;
    const prevKey = `${prevEntry.date}-${prevEntry.time}`;
    let gameIds = localStorage.getItem('gameIds');

    // initialize gameIds in localstorage
    if (!gameIds) {
        const games = {
            [key]: 1,
        };
        localStorage.setItem('gameIds', JSON.stringify(games));
        return 1;
    }

    // gameIds exists in localStorage
    gameIds = JSON.parse(gameIds);
    if (gameIds[key]) {
        return gameIds[key];
    }

    // new gameId
    // should only be here when iterating over players, not games
    gameIds[key] = gameIds[prevKey] + 1;
    localStorage.setItem('gameIds', JSON.stringify(gameIds));
    return gameIds[key] + 1;
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

function getPlayerStatsWithDerivedStats(datum) {
    const playerStats = convertStringStatsToNumbers(datum);
    const { ab, singles, doubles, triples, hr, sac } = playerStats;
    const hits = getHits(singles, doubles, triples, hr);
    playerStats.o = getOuts(ab, sac, hits);
    playerStats.gp = 1;
    playerStats.w = isOnWinningTeam(datum) ? 1 : 0;
    playerStats.l = !isOnWinningTeam(datum) ? 1 : 0;

    return withUntrackedStats(playerStats);
}

function parseCurrentYear(date) {
    return date.split('/')[2];
}

function parseCurrentMonth(date) {
    return date.split('/')[0];
}

async function getPlayerDataFromMeetup(id) {
    const playerData = await fetchJsonp(
        `${process.env.PLAYER_URL}${id}?&sign=true&photo-host=public`,
    )
        .then((response) => response.json())
        .then((playerResult) => playerResult)
        .catch((error) => {
            throw new Error(error);
        });
    return playerData;
}

/**
 * Transform Meetup data properties
 * @param {Object} data
 */
function transformMeetupData(data) {
    const { name, joined, gender, group_profile, is_pro_admin, id, photo, status } = data;

    return {
        id: id.toString(),
        admin: is_pro_admin,
        gender: getGender(gender),
        joined: joined.toString(),
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