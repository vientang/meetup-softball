import omit from 'lodash/omit';
import { addDerivedStats, getTeamTotalHits, getTeamRunsScored } from './statsCalc';
import { submitGameStat } from './apiService';

export default {
    save: async (currentGame, winners, losers, playerOfTheGame) => {
        const gameStats = mergeGameStats(currentGame, winners, losers, playerOfTheGame);
        gameStats.winners = JSON.stringify(gameStats.winners);
        gameStats.losers = JSON.stringify(gameStats.losers);
        await submitGameStat({ input: gameStats });
    },
};

/**
 * GAMESTATS Adaptor to combine data from meetup and current game stats
 * @param {Array} meetupData - data from meetup api
 * @param {Array} w - winners
 * @param {Array} l - losers
 * @return {Object} gameStats
 */
export function mergeGameStats(meetupData, w, l, playerOfTheGame = {}) {
    function addPlayerOfTheGame(player) {
        if (player.id && player.id === playerOfTheGame.id) {
            const starPlayer = { ...player };
            starPlayer.playerOfTheGame = true;
            return starPlayer;
        }
        return player;
    }
    const gameStats = omit(meetupData, ['players']);
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

    gameStats.winners = JSON.stringify(winners);
    gameStats.losers = JSON.stringify(losers);
    gameStats.playerOfTheGame = JSON.stringify(playerOfTheGame);

    return gameStats;
}
