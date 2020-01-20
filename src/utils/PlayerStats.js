import pick from 'lodash/pick';
import omit from 'lodash/omit';
import get from 'lodash/get';
import { removeDuplicateGames, replaceEmptyStrings } from './helpers';
import { createNewPlayerStats, fetchPlayerStats, updateExistingPlayer } from './apiService';
import { addDerivedStats, getTeamRunsScored } from './statsCalc';
import { gameProperties } from './constants';

export default {
    save: async (players) => {
        players.forEach(async (player) => {
            const { id, games, name } = player;
            const currentGame = games[0];
            // check if player already exists in database
            const existingPlayer = await fetchPlayerStats(player.id);
            try {
                if (existingPlayer) {
                    const { games } = existingPlayer;
                    if (!isDuplicateGame(games, currentGame.id)) {
                        await updateExistingPlayer({
                            input: {
                                id,
                                games: JSON.stringify([...games, currentGame]),
                            },
                        });
                    }
                } else {
                    await createNewPlayerStats({
                        input: {
                            id,
                            name,
                            games: JSON.stringify([currentGame]),
                        },
                    });
                }
            } catch (e) {
                console.log(`Error saving player ${existingPlayer.name}: `, e);
                throw new Error(`Error saving player ${existingPlayer.name}: `, e);
            }
        });
    },
};

/**
 * PLAYERSTATS Adaptor to combine data from meetup and current game stats
 * @param {Array} meetupData - data from meetup api
 * @param {Array} w - winners
 * @param {Array} l - losers
 * @param {Object} playerOfTheGame
 * @return {Array} [{ id, name, games }]
 */
export function mergePlayerStats(meetupData, w, l, playerOfTheGame) {
    const gameProps = pick(meetupData, gameProperties);
    const isTie = getTeamRunsScored(w) === getTeamRunsScored(l);
    const winners = createPlayerData(addDerivedStats(w, isTie, true), gameProps);
    const losers = createPlayerData(addDerivedStats(l, isTie), gameProps);
    return winners.concat(losers).map((player) => {
        const currPlayer = { ...player };
        currPlayer.games[0].playerOfTheGame = isPlayerOfTheGame(player, playerOfTheGame);
        return currPlayer;
    });
}

export function isPlayerOfTheGame(player, playerOfTheGame) {
    if (!playerOfTheGame) {
        return null;
    }
    const potgId = get(playerOfTheGame, 'id', '');
    return player.id === potgId.toString();
}

export function isDuplicateGame(games, id) {
    let parsedGames = games;
    if (typeof games === 'string') {
        parsedGames = JSON.parse(games);
    }
    return parsedGames.some((game) => game.id === id);
}

/**
 * Create player data
 * @param {*} players
 * @param {*} currentGameStats
 */
export function createPlayerData(players, gameProps) {
    return players.map((player) => {
        const gameStats = omit(player, ['id', 'name', 'joined', 'photos', 'profile', 'admin']);
        return {
            id: `${player.id}`,
            games: [{ ...gameProps, ...gameStats }],
            name: player.name,
        };
    });
}

/**
 * Use this flow to remove duplicate games and normalize stat values
 * const playerStats = await fetchAllPlayerStats({ limit: 500 });
 * const stats = normalizeGames(playerStats);
 * updatePlayerGames(stats);
 * @param {Array} players
 */
export function normalizeGames(players) {
    const stats = {};
    const duplicates = {};
    players.forEach((player) => {
        if (!stats[player.id]) {
            const [uniq, dupes] = removeDuplicateGames(player.games);
            const games = replaceEmptyStrings(Object.values(uniq));
            stats[player.id] = games;
            if (Object.keys(dupes).length && !duplicates[player.id]) {
                duplicates[player.id] = dupes;
            }
        }
    });
    return stats;
}

export async function updatePlayerGames(stats) {
    Object.keys(stats).forEach(async (playerId) => {
        const games = stats[playerId];
        try {
            await updateExistingPlayer({
                input: {
                    id: playerId,
                    games: JSON.stringify(games),
                },
            });
        } catch (e) {
            throw new Error(`Error saving player ${playerId}: `, e);
        }
    });
}
