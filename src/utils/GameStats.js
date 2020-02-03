import { API, graphqlOperation } from 'aws-amplify';
import omit from 'lodash/omit';
import { createGameStats, updateGameStats } from '../graphql/mutations';
import { addDerivedStats, getTeamTotalHits, getTeamRunsScored } from './statsCalc';

export default {
    save: async (currentGame, winners, losers, playerOfTheGame) => {
        const game = prepareGameStats(currentGame, winners, losers, playerOfTheGame);
        console.log('GameStats', game);
        // localStorage.setItem('gameStats', JSON.stringify(game));
        // localStorage.removeItem('gameStats');
        // const tempGameStats = localStorage.getItem('gameStats');

        // await submitGame({ input: game });
    },
};

/**
 * Submit a new game to database
 * @param {Object} input - { input: { id, name, date, year, winners, losers ... } }
 */
async function submitGame(input) {
    try {
        await API.graphql(graphqlOperation(createGameStats, input));
    } catch (e) {
        throw new Error(`Error saving game: `, e);
    }
}

/**
 * Update a game in database
 * @param {Object} input - { input: { id, name, date, year, winners, losers ... } }
 */
async function updateGame(input) {
    try {
        await API.graphql(graphqlOperation(updateGameStats, input));
    } catch (e) {
        throw new Error(`Error updating game`, e);
    }
}

/**
 * GAMESTATS Adaptor to combine data from meetup and current game stats
 * @param {Array} meetupData - data from meetup api
 * @param {Array} w - winners
 * @param {Array} l - losers
 * @param {Object} playerOfTheGame - { id, name, winner: Boolean }
 * @return {Object} gameStats
 */
export function prepareGameStats(meetupData, w, l, playerOfTheGame = {}) {
    const gameStats = omit(meetupData, ['players']);
    const isTie = getTeamRunsScored(w) === getTeamRunsScored(l);

    const winningTeam = addDerivedStats(w, isTie, true);
    const losingTeam = addDerivedStats(l, isTie, false);

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

    gameStats.lat = `${gameStats.lat}`;
    gameStats.lon = `${gameStats.lon}`;
    gameStats.timeStamp = `${gameStats.timeStamp}`;
    gameStats.winners = JSON.stringify(winners);
    gameStats.losers = JSON.stringify(losers);
    gameStats.playerOfTheGame = JSON.stringify(playerOfTheGame);

    return gameStats;
}
