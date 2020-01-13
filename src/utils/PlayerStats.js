import pick from 'lodash/pick';
import omit from 'lodash/omit';
import get from 'lodash/get';
import { createNewPlayerStats, fetchPlayerStats, updateExistingPlayer } from './apiService';
import { addDerivedStats, getTeamRunsScored } from './statsCalc';
import { gameProperties } from './constants';

export default {
    save: async (players) => {
        players.forEach(async (player) => {
            // check if player already exists in database
            const existingPlayer = await fetchPlayerStats(player.id);
            console.log('PlayerStats player', { existingPlayer, player });
            // try {
            //     if (existingPlayer) {
            //         const { games } = existingPlayer;
            //         await updateExistingPlayer({
            //             input: {
            //                 id: player.id,
            //                 games: JSON.stringify([...games, player.games[0]]),
            //             },
            //         });
            //     } else {
            //         await createNewPlayerStats({
            //             input: {
            //                 id: player.id,
            //                 name: player.name,
            //                 games: JSON.stringify([player.games[0]]),
            //             },
            //         });
            //     }
            // } catch (e) {
            //     console.log((`Error saving player ${existingPlayer.name}: `, e));
            //     throw new Error(`Error saving player ${existingPlayer.name}: `, e);
            // }
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
