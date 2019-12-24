import pick from 'lodash/pick';
import omit from 'lodash/omit';
import { createNewPlayerStats, fetchPlayerStats, updateExistingPlayer } from './apiService';
import { addDerivedStats, getTeamRunsScored } from './statsCalc';
import { gameProperties } from './constants';

export default {
    save: async (players) => {
        // await submitPlayerStats(players);
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
        if (player.id === playerOfTheGame.id.toString()) {
            const starPlayer = { ...player };
            starPlayer.games[0].playerOfTheGame = true;
            return starPlayer;
        }
        return player;
    });
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

export async function submitPlayerStats(players = []) {
    players.forEach(async (player) => {
        // check if player already exists in database
        const existingPlayer = await fetchPlayerStats(player.id);
        try {
            if (existingPlayer) {
                await updateExistingPlayer({
                    input: {
                        id: player.id,
                        games: JSON.stringify(player.games),
                    },
                });
            } else {
                await createNewPlayerStats({
                    input: {
                        ...player,
                        games: JSON.stringify(player.games),
                    },
                });
            }
        } catch (e) {
            throw new Error(`Error saving player ${existingPlayer.name}: `, e);
        }
    });
}
