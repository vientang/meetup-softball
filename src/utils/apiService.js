import Amplify, { API, graphqlOperation } from 'aws-amplify';
import fetchJsonp from 'fetch-jsonp';
import get from 'lodash/get';
import {
    getGameStats,
    getMetaData,
    getPlayers,
    getPlayerStats,
    listGameStatss,
    listSummarizedStatss,
    listPlayerss,
    listPlayerStatss,
    getSummarizedStats,
} from '../graphql/queries';
import {
    createGameStats,
    createMetaData,
    createPlayerStats,
    createPlayers,
    createSummarizedStats,
    updateMetaData,
    updateGameStats,
    updatePlayers,
    updateSummarizedStats,
} from '../graphql/mutations';
import { createGame, parsePhotosAndProfile } from './helpers';
import configuration from '../aws-exports';

Amplify.configure({
    ...configuration,
    aws_project_region: process.env.APPSYNC_REGION,
    aws_appsync_apiKey: process.env.APPSYNC_API_KEY,
    aws_appsync_graphqlEndpoint: process.env.APPSYNC_GRAPHQL_URL,
    aws_appsync_region: process.env.APPSYNC_REGION,
    aws_appsync_authenticationType: process.env.APPSYNC_AUTH_TYPE,
});

/** PLAYER STATS */
let playerStats = [];
export function clearAllPlayerStats() {
    playerStats = [];
}
export async function fetchAllPlayerStats(queryParams) {
    const allPlayers = await API.graphql(graphqlOperation(listPlayerStatss, queryParams));
    const { items, nextToken } = allPlayers.data.listPlayerStatss;
    playerStats.push(...items);
    if (nextToken) {
        const queries = { ...queryParams };
        queries.nextToken = nextToken;
        await fetchAllPlayerStats(queries);
    }

    return playerStats;
}

export async function fetchPlayerStats(id) {
    let existingPlayer = await API.graphql(graphqlOperation(getPlayerStats, { id }));
    existingPlayer = get(existingPlayer, 'data.getPlayerStats', null);
    if (existingPlayer) {
        existingPlayer.games = JSON.parse(existingPlayer.games);
    }
    return existingPlayer;
}

export async function createNewPlayerStats(input) {
    try {
        await API.graphql(graphqlOperation(createPlayerStats, input));
    } catch (e) {
        throw new Error(`Error creating new player stats`, e);
    }
}

// export async function updateExistingPlayer(input) {
//     try {
//         await API.graphql(graphqlOperation(updatePlayerStats, input));
//     } catch (e) {
//         throw new Error(`Error updating player stats`, e);
//     }
// }

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

/** PLAYER INFO */
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

export async function fetchPlayerInfo(id) {
    let existingPlayer = await API.graphql(graphqlOperation(getPlayers, { id }));
    existingPlayer = get(existingPlayer, 'data.getPlayers', null);
    if (existingPlayer) {
        const { photos, profile } = parsePhotosAndProfile(existingPlayer);
        existingPlayer.photos = photos;
        existingPlayer.profile = profile;
    }
    return existingPlayer;
}

export async function createNewPlayerInfo(input) {
    await API.graphql(graphqlOperation(createPlayers, input));
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

export async function updateExistingPlayerInfo(input) {
    try {
        await API.graphql(graphqlOperation(updatePlayers, input));
    } catch (e) {
        throw new Error(`Error updating player info`, e);
    }
}

/** SUMMARIZED STATS */
export async function fetchSummarizedStats(id) {
    let summarizedStats = await API.graphql(graphqlOperation(getSummarizedStats, { id }));
    summarizedStats = get(summarizedStats, 'data.getSummarizedStats.stats', null);
    return summarizedStats && JSON.parse(summarizedStats);
}

let summarized = [];
export function clearAllSummarized() {
    summarized = [];
}

export async function fetchAllSummarizedStats(queryParams = {}) {
    const summarizedStats = await API.graphql(graphqlOperation(listSummarizedStatss, queryParams));
    const { items, nextToken } = summarizedStats.data.listSummarizedStatss;
    summarized.push(...items);
    if (nextToken) {
        const queries = { ...queryParams };
        queries.nextToken = nextToken;
        await fetchAllSummarizedStats(queries);
    }
    return summarized;
}

export async function updateExistingSummarizedStats(input) {
    await API.graphql(graphqlOperation(updateSummarizedStats, input));
}

export async function createNewSummarizedStats(input) {
    await API.graphql(graphqlOperation(createSummarizedStats, input));
}

export async function submitSerializeSummary(summarized) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [k, v] of summarized) {
        // eslint-disable-next-line no-await-in-loop
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

/** META DATA */
export async function fetchMetaData() {
    let metadata = await API.graphql(graphqlOperation(getMetaData, { id: '_metadata' }));
    metadata = get(metadata, 'data.getMetaData', null);
    return metadata;
}

export async function createMetaDataEntry(input) {
    try {
        await API.graphql(graphqlOperation(createMetaData, input));
    } catch (e) {
        throw new Error(`Error creating metadata: ${e}`);
    }
}

export async function updateMetaDataEntry(input) {
    try {
        await API.graphql(graphqlOperation(updateMetaData, input));
    } catch (e) {
        throw new Error(`Error updating metadata: ${e}`);
    }
}

/** GAME STATS */
export async function fetchGameStats(id) {
    let gameStats = await API.graphql(graphqlOperation(getGameStats, { id }));
    gameStats = get(gameStats, 'data.getGameStats', null);
    if (gameStats) {
        gameStats.winners = JSON.parse(gameStats.winners);
        gameStats.losers = JSON.parse(gameStats.losers);
    }
    return gameStats;
}

export async function submitGameStats(gameStats) {
    gameStats.forEach(async (value) => {
        const game = { ...value };
        game.winners = JSON.stringify(value.winners);
        game.losers = JSON.stringify(value.losers);
        try {
            await API.graphql(graphqlOperation(createGameStats, { input: game }));
        } catch (e) {
            throw new Error(`Error saving game: `, e);
        }
    });
}

export async function submitGameStat(input) {
    try {
        // second param should be an object with one property - input
        // input should be an object of fields of a game
        await API.graphql(graphqlOperation(createGameStats, input));
    } catch (e) {
        throw new Error(`Error saving game: `, e);
    }
}

// query params accepts two properties - filter and limit
// i.e. { filter: { year: { eq: '2020' } }, limit: 800 }
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

export async function updateGame(input) {
    try {
        await API.graphql(graphqlOperation(updateGameStats, input));
    } catch (e) {
        throw new Error(`Error updating game`, e);
    }
}
/** MEETUP API */
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

export async function fetchNextGamesFromMeetup() {
    const games = [];

    await fetchJsonp(process.env.NEXT_MEETUP_GAMES_URL)
        .then((response) => response.json())
        .then((result) => {
            games.push(...result.data);
        })
        .catch((error) => {
            throw new Error(error);
        });

    games.sort((a, b) => new Date(a.time) - new Date(b.time));

    return games;
}

/**
 * Fetch past games that were played after the last recorded game
 */
export async function fetchGamesFromMeetup(lastGameTimeStamp) {
    const games = [];

    await fetchJsonp(process.env.PAST_MEETUP_GAMES_URL)
        .then((response) => response.json())
        .then((result) => {
            result.data.forEach((game) => {
                // prevent overfetching games from meetup
                if (lastGameTimeStamp >= game.time) {
                    return;
                }
                // include games played after the last game
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
    const RSVPS = `${process.env.RSVP_URL}/${gameId}/attendance?&sign=true&photo-host=public`;

    let rsvpList = await fetchJsonp(RSVPS)
        .then((response) => response.json())
        .then((result) => result.data.filter(filterAttendees))
        .catch((error) => {
            throw new Error(error);
        });

    rsvpList = await rsvpList.map((player) =>
        fetchJsonp(`${process.env.PLAYER_URL}/${player.member.id}?&sign=true&photo-host=public`)
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
