import { API, graphqlOperation } from 'aws-amplify';
import fetchJsonp from 'fetch-jsonp';
import get from 'lodash/get';
import {
    getPlayers,
    getPlayerStats,
    listGameStatss,
    listPlayerss,
    getSummarizedStats,
} from '../graphql/queries';
import {
    createGameStats,
    createPlayerStats,
    createPlayers,
    createSummarizedStats,
    updatePlayerStats,
} from '../graphql/mutations';
import { createGame } from './helpers';

export async function fetchPlayerStats(id) {
    const existingPlayer = await API.graphql(graphqlOperation(getPlayerStats, { id }));    
    return get(existingPlayer, 'data.getPlayerStats', null);
}

export async function fetchPlayerInfo(id) {
    const existingPlayer = await API.graphql(graphqlOperation(getPlayers, { id }));
    return get(existingPlayer, 'data.getPlayers', null);
}

export async function fetchSummarizedStats(id) {
    const summarizedStats = await API.graphql(graphqlOperation(getSummarizedStats, { id }));
    return get(summarizedStats, 'data.getSummarizedStats.stats', null);
}

export async function updateExistingPlayer(input) {
    await API.graphql(graphqlOperation(updatePlayerStats, input));
}

export async function createNewPlayerStats(input) {
    await API.graphql(graphqlOperation(createPlayerStats, input));
}

export async function submitNewGameStats(input) {
    await API.graphql(graphqlOperation(createGameStats, input));
}

export async function submitSerializeSummary(summarized) {
    for (const [k, v] of summarized) {
        await API.graphql(
            graphqlOperation(createSummarizedStats, {
                input: {
                    id: k,
                    stats: JSON.stringify(v),
                },
            }),
        );
    }
}

export async function submitPlayerInfo(playerInfo = []) {
    playerInfo.forEach(async (player) => {
        await API.graphql(
            graphqlOperation(createPlayers, {
                input: player,
            }),
        );
    });
}

/**
 * Update a players game log or create a new player
 * @param {Array} playerStats
 */
export async function submitPlayerStats(playerStats = []) {
    playerStats.forEach(async (player) => {
        await API.graphql(
            graphqlOperation(createPlayerStats, {
                input: {
                    ...player,
                    games: JSON.stringify(player.games),
                },
            }),
        );
    });
}

export async function submitGameStats(gameStats) {
    gameStats.forEach(async (value) => {
        const game = { ...value };
        game.winners = JSON.stringify(value.winners);
        game.losers = JSON.stringify(value.losers);
        await API.graphql(graphqlOperation(createGameStats, { input: game }));
    });
}

let players = [];
export function clearAllPlayers() {
    players = [];
}

export async function fetchAllPlayers(queryParams = {}) {
    const fetchedPlayers = await API.graphql(graphqlOperation(listPlayerss, queryParams));
    const { items, nextToken } = fetchedPlayers.data.listPlayerss;
    players.push(...items);
    if (nextToken) {
        const queries = { ...queryParams };
        queries.nextToken = nextToken;
        await fetchAllPlayers(queries);
    }
    return players;
}

const games = [];
export async function fetchAllGames(queryParams = {}) {
    const fetchedGames = await API.graphql(graphqlOperation(listGameStatss, queryParams));
    const { items, nextToken } = fetchedGames.data.listGameStatss;
    games.push(...items);
    if (nextToken) {
        const queries = { ...queryParams };
        queries.nextToken = nextToken;
        await fetchAllGames(queries);
    }

    return games;
}

export async function getPlayerDataFromMeetup(id) {
    const meetupId = id;
    if (!meetupId) {
        return null;
    }

    const playerData = await fetchJsonp(
        `${process.env.PLAYER_URL}/${meetupId}?&sign=true&photo-host=public`,
    )
        .then((response) => response.json())
        .then((playerResult) => playerResult)
        .catch((error) => {
            throw new Error(error);
        });

    return playerData;
}

/**
 * Get data from meetup api - games and players
 * Find those players in our API to get existing stats
 * Merge each player name and meetup id with the stats categories
 */
export async function fetchGamesFromMeetup() {
    const lastGameTimeStamp = await this.getLastGameRecorded();

    const games = [];

    await fetchJsonp(process.env.GAMES_URL)
        .then((response) => response.json())
        .then((result) => {
            result.data.forEach((game) => {
                // prevent overfetching games from meetup
                if (lastGameTimeStamp >= game.time) {
                    return;
                }
                games.push(createGame(game));
            });
        })
        .catch((error) => {
            throw new Error(error);
        });

    // sort games by time for GamesMenu
    games.sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));

    return games;
}

export async function fetchRsvpList(gameId) {
    const RSVPS = `${process.env.RSVP_URL}${gameId}/attendance?&sign=true&photo-host=public`;

    let rsvpList = await fetchJsonp(RSVPS)
        .then((response) => response.json())
        .then((result) => result.data.filter(filterAttendees))
        .catch((error) => {
            throw new Error(error);
        });

    rsvpList = await rsvpList.map((player) =>
        fetchJsonp(`${process.env.PLAYER_URL}${player.member.id}?&sign=true&photo-host=public`)
            .then((response) => response.json())
            .then((playerResult) => playerResult),
    );

    return rsvpList;
}

/**
 * Data from Meetup API is inconsistent
 * Catch the different permutations of attendance
 * @param {Object} player
 * @return {Boolean}
 */
function filterAttendees(player = {}) {
    const status = get(player, 'status');
    const response = get(player, 'rsvp.response');
    if ((status && status === 'absent') || status === 'noshow') {
        return false;
    }
    if (response === 'yes') {
        return true;
    }
    return status === 'attended';
}
