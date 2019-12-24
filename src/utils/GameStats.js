import omit from 'lodash/omit';
import { createGameStats } from '../graphql/mutations';
import { addDerivedStats, getTeamTotalHits, getTeamRunsScored } from './statsCalc';

export default {
    save: async (currentGame, winners, losers, playerOfTheGame) => {
        const gameStats = mergeGameStats(currentGame, winners, losers, playerOfTheGame);
        // gameStats.forEach(async (value) => {
        //     const game = { ...value };
        //     game.winners = JSON.stringify(value.winners);
        //     game.losers = JSON.stringify(value.losers);
        //     try {
        //         // second param should be an object with one property - input
        //         // input should be an object of fields of a game
        //         await API.graphql(graphqlOperation(createGameStats, { input: game }));
        //     } catch (e) {
        //         throw new Error(`Error saving game: ${e}`);
        //     }
        // });
    },
};

/**
 * GAMESTATS Adaptor to combine data from meetup and current game stats
 * @param {Array} meetupData - data from meetup api
 * @param {Array} w - winners
 * @param {Array} l - losers
 * @return {Object} currentGameStats
 */
export function mergeGameStats(meetupData, w, l, playerOfTheGame) {
    function addPlayerOfTheGame(player) {
        if (player.id === playerOfTheGame.id) {
            const starPlayer = { ...player };
            starPlayer.playerOfTheGame = true;
            return starPlayer;
        }
        return player;
    }
    const currentGameStats = omit(meetupData, ['players']);
    const isTie = getTeamRunsScored(w) === getTeamRunsScored(l);

    const winningTeam = addDerivedStats(w, isTie, true).map(addPlayerOfTheGame);
    const losingTeam = addDerivedStats(l, isTie, false).map(addPlayerOfTheGame);

    const winners = {
        name: 'Winners',
        runsScored: getTeamRunsScored(winningTeam),
        totalHits: getTeamTotalHits(winningTeam),
        players: winningTeam,
    };
    const losers = {
        name: 'Losers',
        runsScored: getTeamRunsScored(losingTeam),
        totalHits: getTeamTotalHits(losingTeam),
        players: losingTeam,
    };

    currentGameStats.winners = JSON.stringify(winners);
    currentGameStats.losers = JSON.stringify(losers);
    currentGameStats.playerOfTheGame = JSON.stringify(playerOfTheGame);

    return currentGameStats;
}
