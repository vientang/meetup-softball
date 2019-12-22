/* eslint-disable no-restricted-syntax, no-await-in-loop */
import {
    fetchMetaData,
    fetchPlayerStats,
    fetchSummarizedStats,
    getPlayerDataFromMeetup,
} from './apiService';
import { calculateTotals, getHits, getOuts } from './statsCalc';
import {
    convertStringStatsToNumbers,
    getFieldName,
    getIdFromFilterParams,
    parseCurrentYear,
    parseCurrentMonth,
} from './helpers';

const legacyPlayerStats = new Map();
const legacyPlayers = new Map();
const legacyGames = new Map();
const gameIds = new Map();
const currentGameData = new Map();
const legacySummarized = {}; // this could probably be a map too
const CURRENT_GAME_SIZE = 513;

/**
 * Convert legacy data structure for PlayerStats schema
 * @param {Array}
 * @return {Array}
 */
export async function convertLegacyPlayerData(data, allFields) {
    for (const datum of data) {
        const playerId = `${datum.id}`;
        // locate player in local map or in database
        const existingPlayer = await findPlayer(playerId);

        // format game data and calculate stats
        const gameData = buildGameData(datum, allFields);
        const gameStats = buildGameStats(datum, existingPlayer);

        if (existingPlayer) {
            existingPlayer.games.push({ ...gameData, ...gameStats });
            legacyPlayerStats.set(playerId, existingPlayer);
        } else {
            const playerDataFromMeetup = await getPlayerDataFromMeetup(playerId);

            // exclude players not found
            if (!playerDataFromMeetup || playerDataFromMeetup.data.errors) {
                continue;
            }

            // PlayerStats
            const playerStats = {
                id: playerId,
                name: playerDataFromMeetup.data.name,
            };

            try {
                playerStats.games = [];
                playerStats.games.push({ ...gameData, ...gameStats });
                legacyPlayerStats.set(playerId, playerStats);
            } catch (error) {
                throw new Error(error);
            }
        }
    }

    return [...legacyPlayerStats.values()];
}

/**
 * Updates a players basic information based from Meetups API
 * @param {Array}
 * @return {Array}
 */
export async function updateLegacyPlayerInfo(data) {
    for (const datum of data) {
        const playerId = `${datum.id}`;
        // locate player in legacyPlayers map
        const existingPlayer = await findPlayerInfo(playerId);
        if (!existingPlayer) {
            const playerDataFromMeetup = await getPlayerDataFromMeetup(playerId);
            // exclude players not found
            if (!playerDataFromMeetup || playerDataFromMeetup.data.errors) {
                continue;
            }
            const playerInfo = await adaptForPlayersAPI({
                ...playerDataFromMeetup.data,
                id: playerId,
                gender: getGender(Number(datum.gender)),
            });
            try {
                legacyPlayers.set(playerId, playerInfo);
            } catch (error) {
                throw new Error(error);
            }
        }
    }

    return [...legacyPlayers.values()];
}

async function findPlayer(id) {
    return legacyPlayerStats.get(id) || fetchPlayerStats(id);
}

async function findPlayerInfo(id) {
    return legacyPlayers.get(id);
}

export async function convertLegacyGameData(data, allFields) {
    for (const datum of data) {
        const playerId = `${datum.id}`;
        const playerData = getPlayerDataForGameStats(playerId);

        // playerData was determined in convertLegacyPlayerData
        // does not exist if a players meetup account was closed
        if (!playerData) {
            continue;
        }

        // get player stats && add derived stats
        const playerStats = buildGameStats(datum);
        const { singles, doubles, triples, hr, r } = playerStats;
        const hits = getHits(singles, doubles, triples, hr);

        // combine data and stats
        const player = { ...playerData, ...playerStats };

        // set up game data properties - date, field, time, gameId, etc.
        const gameData = buildGameData(datum, allFields);
        const legacyGame = legacyGames.get(gameData.gameId);
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

            legacyGames.set(gameData.gameId, legacyGame);
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

            legacyGames.set(gameData.gameId, gameData);
        }
    }

    return [...legacyGames.values()];
}

/**
 * Get player data from legacyPlayerStats map
 * Then remove games - not needed for GameStats
 * @param {String} playerId
 */
function getPlayerDataForGameStats(playerId) {
    const playerData = legacyPlayerStats.get(playerId);

    if (!playerData) {
        return null;
    }

    return {
        id: playerData.id,
        name: playerData.name,
    };
}

export async function buildSummarizedStats(games) {
    for (const game of games) {
        const { field, month, year } = game;
        const filterYear = getIdFromFilterParams({ year });
        await calculateSummarized(game, filterYear);
        const filterMonth = getIdFromFilterParams({ month });
        await calculateSummarized(game, filterMonth);
        const filterYearMonth = getIdFromFilterParams({ year, month });
        await calculateSummarized(game, filterYearMonth);
        const filterYearMonthField = getIdFromFilterParams({ year, month, field });
        await calculateSummarized(game, filterYearMonthField);
        const filterMonthField = getIdFromFilterParams({ month, field });
        await calculateSummarized(game, filterMonthField);
        const filterYearField = getIdFromFilterParams({ year, field });
        await calculateSummarized(game, filterYearField);
        const filterField = getIdFromFilterParams({ field });
        await calculateSummarized(game, filterField);
    }

    return legacySummarized;
}

async function calculateSummarized(game, filter) {
    const existingStats = await getLegacySummarizedStats(filter);
    if (existingStats) {
        const currentStats = getWinnersAndLosers(game);
        const summarizedStats = mergeStatsForSummary(existingStats, currentStats);
        legacySummarized[filter] = summarizedStats;
    } else {
        const stats = getWinnersAndLosers(game);
        legacySummarized[filter] = stats;
    }
}

async function getLegacySummarizedStats(filterId) {
    let legacyStats = await fetchSummarizedStats(filterId);
    if (!legacyStats && legacySummarized[filterId]) {
        // if legacy stats do not exist on remote database
        // let's get it from local
        legacyStats = legacySummarized[filterId];
    }
    return legacyStats;
}

function getWinnersAndLosers(game) {
    return game.winners.players.concat(game.losers.players);
}

function mergeStatsForSummary(existingPlayers, currentPlayers) {
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

export async function updateMetadata(games) {
    const metadata = await fetchMetaData();
    const allFields = JSON.parse(metadata.allFields);
    const allYears = JSON.parse(metadata.allYears);
    const activePlayers = JSON.parse(metadata.activePlayers);
    const inactivePlayers = JSON.parse(metadata.inactivePlayers);
    const perYear = JSON.parse(metadata.perYear);
    const { totalGamesPlayed, totalPlayersCount } = metadata;

    const playersToBeActive = getPlayersToBeActive(games, inactivePlayers);
    const inactivePlayersUpdated = updateInactivePlayers(inactivePlayers, playersToBeActive);
    const activePlayersUpdated = updateActivePlayers(games, activePlayers);
    const newPlayers = getNewPlayers(games, activePlayers, playersToBeActive);
    const totalActives = getTotalActivePlayers(activePlayers, activePlayersUpdated);
    const allActivePlayers2019 = totalActives.concat(playersToBeActive, newPlayers);
    const { year, fields, months, gp } = updatePerYear(games);
    const perYearUpdated = { ...perYear, [year]: { fields, months, gp } };
    const newRecentGames = games.slice(-5);
    newRecentGames.sort((a, b) => (a.timeStamp > b.timeStamp ? -1 : 1));

    // console.log('playersToBeActive should be 14', playersToBeActive);
    // console.log('inactivePlayersUpdated should be 265', inactivePlayersUpdated);
    // console.log('activePlayersUpdated should be 72', activePlayersUpdated);
    // console.log('newPlayers should be 42', newPlayers);
    // console.log('total active players should be same as before', totalActives);
    // console.log('all active players should be be 191', allActivePlayers2019);
    // console.log('perYearUpdated should combine 2019 data', perYearUpdated);
    // console.log('totalPlayersCount should be 454', totalPlayersCount + newPlayers.length);
    return {
        id: '_metadata',
        activePlayers: JSON.stringify(allActivePlayers2019),
        inactivePlayers: JSON.stringify(inactivePlayersUpdated),
        allFields: JSON.stringify(getNewFields(games, allFields)),
        allYears: JSON.stringify(getNewYears(games, allYears)),
        perYear: JSON.stringify(perYearUpdated),
        recentGames: JSON.stringify(newRecentGames),
        totalGamesPlayed: totalGamesPlayed + games.length,
        totalPlayersCount: totalPlayersCount + newPlayers.length,
    };
    // return {
    //     id: '_metadata',
    //     activePlayers: allActivePlayers2019,
    //     inactivePlayers: inactivePlayersUpdated,
    //     allFields: getNewFields(games, allFields),
    //     allYears: getNewYears(games, allYears),
    //     perYear: perYearUpdated,
    //     recentGames: newRecentGames,
    //     totalGamesPlayed: totalGamesPlayed + games.length,
    //     totalPlayersCount: totalPlayersCount + newPlayers.length,
    // };
}

function getNewFields(games, allFields) {
    const newFields = { ...allFields };
    const fields = [];
    for (const game of games) {
        const currentField = getFieldName(game.field, allFields);
        if (!allFields[currentField]) {
            fields.push(currentField);
        }
    }
    if (fields.length > 0) {
        fields.forEach((field) => {
            newFields[field] = field;
        });
    }
    return newFields;
}

function getNewYears(games, allYears) {
    const newYears = { ...allYears };
    const years = [];
    for (const game of games) {
        if (!allYears[game.year]) {
            years.push(game.year);
        }
    }
    if (years.length > 0) {
        years.forEach((year) => {
            newYears[year] = year;
        });
    }
    return newYears;
}

function getPlayersToBeActive(games, inactivePlayers) {
    const playersToBeActive = {};
    for (const game of games) {
        getWinnersAndLosers(game).forEach((player) => {
            // check if current player is inactive
            const playerToBeActive = inactivePlayers.find(
                (inactive) => inactive.id === player.id && !playersToBeActive[player.id],
            );
            if (playerToBeActive) {
                playersToBeActive[player.id] = playerToBeActive;
            }
        });
    }
    return Object.values(playersToBeActive);
}

function updateActivePlayers(games, activePlayers) {
    const activePlayersUpdated = {};
    for (const game of games) {
        getWinnersAndLosers(game).forEach((player) => {
            // check if current player is active
            if (!activePlayersUpdated[player.id]) {
                const activePlayer = activePlayers.find((active) => active.id === player.id);

                if (activePlayer) {
                    // increment players games played
                    activePlayersUpdated[activePlayer.id] = {
                        ...activePlayer,
                        gp: activePlayer.gp + 1,
                    };
                }
            } else {
                activePlayersUpdated[player.id].gp += 1;
            }
        });
    }
    return Object.values(activePlayersUpdated);
}

/**
 * Pull out any inactive player who will be activated
 * @param {Array} inactivePlayers
 * @param {Array} playersToBeActive
 */
function updateInactivePlayers(inactivePlayers, playersToBeActive) {
    return inactivePlayers.filter(
        (player) => !playersToBeActive.find((activePlayer) => activePlayer.id === player.id),
    );
}

/**
 * Get players who were not found to be active or inactive
 * @param {Array} games
 * @param {Array} activePlayers
 * @param {Array} playersToBeActive includes inactive players who will be activated
 */
function getNewPlayers(games, activePlayers, playersToBeActive) {
    const newPlayers = {};
    for (const game of games) {
        getWinnersAndLosers(game).forEach((player) => {
            if (!newPlayers[player.id]) {
                const activePlayer = activePlayers.find((active) => active.id === player.id);
                const toBeActivePlayer = playersToBeActive.find(
                    (toBeActive) => toBeActive.id === player.id,
                );
                if (!activePlayer && !toBeActivePlayer) {
                    // current player was not found to be active or inactive
                    newPlayers[player.id] = {
                        id: player.id,
                        name: player.name,
                        photos: player.photos,
                        gp: 1,
                    };
                }
            } else {
                newPlayers[player.id].gp += 1;
            }
        });
    }
    return Object.values(newPlayers);
}

function getTotalActivePlayers(prevActives, actives) {
    return prevActives.map((prevPlayer) => {
        const updatedPlayer = actives.find((active) => active.id === prevPlayer.id);
        return updatedPlayer || prevPlayer;
    });
}

function updatePerYear(games) {
    let currentYear;
    const fields = {};
    const months = [];
    for (const game of games) {
        const { field, month, year } = game;
        if (!currentYear && year) {
            currentYear = year;
        }
        if (!fields[field]) {
            fields[field] = 1;
        } else {
            fields[field] += 1;
        }
        if (!months.includes(month)) {
            months.push(month);
        }
    }
    return {
        year: currentYear,
        gp: games.length,
        fields,
        months,
    };
}

function buildGameData({ date, field, time }, allFields) {
    const gameId = getGameId(date, time);
    const fieldName = getFieldName(field, allFields);
    const gameData = {
        date: `${new Date(date)}`.slice(0, 15), // Wed Nov 13 2013
        timeStamp: `${Date.parse(`${date} ${time}`)}`,
        field: fieldName,
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

        const name = `Game ${gameId} @ ${fieldName}`;
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
    const gameId = gameIds.size + CURRENT_GAME_SIZE;
    gameIds.set(key, gameId);

    return gameId;
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
    return { ...stats, ...untracked };
}
