/* eslint-disable no-restricted-syntax, no-await-in-loop */
import { getPlayerDataFromMeetup } from './apiService';
import { calculateTotals, getHits, getOuts } from './statsCalc';
import {
    convertStringStatsToNumbers,
    getIdFromFilterParams,
    parseCurrentYear,
    parseCurrentMonth,
} from './helpers';

const legacyPlayerStats = new Map();
const legacyPlayers = new Map();
const legacyGameList = new Map();
const legacySummarizedStats = new Map();
const gameIds = new Map();
const currentGameData = new Map();

/**
 * Convert legacy data structure to adapt to PlayerStats schema
 * @param {Array}
 * @return {Array}
 */
export async function convertLegacyPlayerData(data) {
    for (const datum of data) {
        const legacyPlayerId = `${datum.id}`;
        const legacyStats = legacyPlayerStats.get(legacyPlayerId);

        // format game data and calculate stats
        const gameData = buildGameData(datum);
        const gameStats = buildGameStats(datum, legacyStats);

        if (legacyStats) {
            legacyStats.games.push({ ...gameData, ...gameStats });
        } else {
            const playerDataFromMeetup = await getPlayerDataFromMeetup(datum.id);

            // exclude players not found
            if (!playerDataFromMeetup || playerDataFromMeetup.data.errors) {
                continue;
            }

            const playerStats = {
                id: `${datum.id}`,
                name: playerDataFromMeetup.data.name,
            };

            const playerInfo = await adaptForPlayersAPI({
                ...playerDataFromMeetup.data,
                id: datum.id,
                gender: Number(datum.gender),
            });

            try {
                playerStats.games = [];
                playerStats.games.push({ ...gameData, ...gameStats });
                legacyPlayerStats.set(legacyPlayerId, playerStats);
                legacyPlayers.set(legacyPlayerId, playerInfo);
            } catch (error) {
                throw new Error(error);
            }
        }
    }

    return {
        playerStats: [...legacyPlayerStats.values()],
        playerInfo: [...legacyPlayers.values()],
    };
}

export function convertLegacyGameData(data) {
    for (const datum of data) {
        const legacyPlayerId = `${datum.id}`;
        const playerDataFromMeetup = getPlayerDataForGameStats(legacyPlayerId);

        // member data no longer available on meetup
        if (!playerDataFromMeetup) {
            continue;
        }

        // get player stats && add derived stats
        const playerStats = getPlayerStatsWithDerivedStats(datum);
        const { singles, doubles, triples, hr, r } = playerStats;
        const hits = getHits(singles, doubles, triples, hr);

        // combine data and stats
        const player = { ...playerDataFromMeetup, ...playerStats };

        // set up game data properties - date, field, time, gameId, etc.
        const gameData = buildGameData(datum);
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
            gameData.winners = buildTeamData('Winners');
            gameData.losers = buildTeamData('Losers');

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

    return [...legacyGameList.values()];
}

export function buildSummarizedStats(games) {
    for (const game of games) {
        const { field, month, year } = game;
        const filterYear = getIdFromFilterParams({ year });
        updateSummarizedStats(game, filterYear);
        const filterMonth = getIdFromFilterParams({ month });
        updateSummarizedStats(game, filterMonth);
        const filterYearMonth = getIdFromFilterParams({ year, month });
        updateSummarizedStats(game, filterYearMonth);
        const filterYearMonthField = getIdFromFilterParams({ year, month, field });
        updateSummarizedStats(game, filterYearMonthField);
        const filterMonthField = getIdFromFilterParams({ month, field });
        updateSummarizedStats(game, filterMonthField);
        const filterYearField = getIdFromFilterParams({ year, field });
        updateSummarizedStats(game, filterYearField);
        const filterField = getIdFromFilterParams({ field });
        updateSummarizedStats(game, filterField);
    }
    return legacySummarizedStats.entries();
}

function updateSummarizedStats(game, filter) {
    if (legacySummarizedStats.has(filter)) {
        const existingPlayers = legacySummarizedStats.get(filter);
        const currentPlayers = getWinnersAndLosers(game);
        const summarizedStats = mergePlayerStatsForSummary(existingPlayers, currentPlayers);
        legacySummarizedStats.set(filter, summarizedStats);
    } else {
        const stats = getWinnersAndLosers(game);
        legacySummarizedStats.set(filter, stats);
    }
}

function getWinnersAndLosers(game) {
    return game.winners.players.concat(game.losers.players);
}

function mergePlayerStatsForSummary(existingPlayers, currentPlayers) {
    const summarizedStats = currentPlayers.map((currentPlayer) => {
        const existingPlayerIndex = existingPlayers.findIndex(
            (existing) => existing.id === currentPlayer.id,
        );
        if (existingPlayerIndex >= 0) {
            const existingPlayer = existingPlayers.splice(existingPlayerIndex, 1)[0];
            const summarizedPlayer = calculateTotals(existingPlayer, currentPlayer);
            summarizedPlayer.id = currentPlayer.id;
            summarizedPlayer.name = currentPlayer.name;
            return summarizedPlayer;
        }
        return currentPlayer;
    });

    return [...summarizedStats, ...existingPlayers];
}

function buildGameData({ date, field, time }) {
    const gameId = getGameId(date, time);
    const gameData = {
        date: `${new Date(date)}`.slice(0, 15), // Wed Nov 13 2013
        timeStamp: `${Date.parse(`${date} ${time}`)}`,
        field,
        time,
        gameId,
    };

    const gameDate = currentGameData.get('date');

    if (gameDate === date) {
        // on current game
        gameData.name = currentGameData.get('name');
        gameData.year = currentGameData.get('year');
        gameData.month = currentGameData.get('month');
    } else {
        // on a different game
        currentGameData.clear();

        const name = `Game ${gameId} @ ${field}`;
        const year = parseCurrentYear(date);
        const month = parseCurrentMonth(date);

        gameData.name = name;
        gameData.year = year;
        gameData.month = month;

        // date is used to match against current date
        // to avoid parsing dates and logic for getting name
        currentGameData.set('date', date);
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

function buildTeamData(name) {
    return {
        name,
        players: [],
        runsScored: 0,
        totalHits: 0,
    };
}

export function getGameId(date, time) {
    const key = `${date}-${time}`;
    if (gameIds.has(key)) {
        return gameIds.get(key);
    }
    const gameId = gameIds.size + 1;
    gameIds.set(key, gameId);

    return gameId;
}

/**
 * Get player data from legacyPlayerStats map
 * Then remove games - not needed for GameStats
 * @param {String} legacyPlayerId
 */
function getPlayerDataForGameStats(legacyPlayerId) {
    const playerData = legacyPlayerStats.get(legacyPlayerId);

    if (!playerData) {
        return null;
    }

    return {
        id: playerData.id,
        name: playerData.name,
    };
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

/**
 * Transform Meetup data properties for Players API
 * @param {Object} data
 */
function adaptForPlayersAPI(data) {
    const { name, joined, gender, group_profile, is_pro_admin, id, photo, status } = data;

    return {
        id: `${id}`,
        admin: is_pro_admin,
        gender: getGender(gender),
        joined: `${joined}`,
        photos: JSON.stringify(photo),
        profile: JSON.stringify(group_profile),
        name,
        status,
    };
}

/**
 * @param {Object} player
 */
function isOnWinningTeam(player) {
    const { winner, team } = player;
    return winner === team;
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
