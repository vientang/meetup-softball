import { API, graphqlOperation } from '@aws-amplify/api';
import get from 'lodash/get';
import pick from 'lodash/pick';
import { fetchAllPlayerStats, fetchPlayerInfo, fetchAllGames } from './apiService';
import { getMetaData } from '../graphql/queries';
import { updateMetaData } from '../graphql/mutations';
import { findPlayers, findPlayerById, asyncForEach, parseMetaData } from './helpers';
import { updateGamesPlayed } from './statsCalc';

export default {
    save: async (currentGame, winners, losers, metadata) => {
        const {
            id,
            activePlayers,
            allFields,
            allYears,
            inactivePlayers,
            perYear,
            recentGames,
            totalGamesPlayed,
        } = metadata;
        const players = winners.concat(losers);
        const actives = updateActivePlayers(activePlayers, inactivePlayers, players);
        const inactives = updateInactivePlayers(inactivePlayers, players);
        const recent = updateRecentGames(recentGames, currentGame);
        const fields = updateAllFields(allFields, currentGame);
        const years = updateAllYears(allYears, currentGame);
        const fieldsMonthsPerYear = updateFieldsMonthsPerYear(perYear, currentGame);
        const data = {
            id,
            activePlayers: JSON.stringify(actives),
            inactivePlayers: JSON.stringify(inactives),
            allFields: JSON.stringify(fields),
            allYears: JSON.stringify(years),
            perYear: JSON.stringify(fieldsMonthsPerYear),
            recentGames: JSON.stringify(recent),
            recentGamesLength: recent.length,
            totalGamesPlayed: totalGamesPlayed + 1,
            totalPlayersCount: actives.length + inactives.length,
        };

        await updateMeta({ input: data });
    },
};

export async function fetchMetaData() {
    let metadata = await API.graphql(graphqlOperation(getMetaData, { id: '_metadata' }));
    metadata = get(metadata, 'data.getMetaData', null);
    if (metadata) {
        return parseMetaData(metadata);
    }
    return metadata;
}

/**
 * Update metadata in database
 * @param {Object} input - { input: { id, activePlayers, inactivePlayers, perYear ... } }
 */
export async function updateMeta(input) {
    try {
        await API.graphql(graphqlOperation(updateMetaData, input));
    } catch (e) {
        throw new Error(`Error updating metadata: ${e}`);
    }
}

/**
 * Sync up games count if it gets out of sync
 * Very expensive call to fetch all games
 */
export async function updateGamesCount() {
    const allGames = await fetchAllGames({ limit: 1000 });
    await updateMeta({
        input: {
            id: '_metadata',
            totalGamesPlayed: allGames.length,
        },
    });
}

/**
 * Sync up total players count if it gets out of sync
 */
export async function updatePlayersCount(metadata) {
    const actives = JSON.parse(metadata.activePlayers);
    const inactives = JSON.parse(metadata.inactivePlayers);
    await updateMeta({
        input: {
            id: '_metadata',
            totalPlayersCount: actives.length + inactives.length,
        },
    });
}

/**
 * Sync up active players if it gets out of sync
 * Very expensive call to fetch all players
 */
export async function updateAllActivePlayers() {
    const allPlayers = await fetchAllPlayerStats({ limit: 600 });
    const activePlayers = allPlayers.filter((player) => {
        const games = JSON.parse(player.games);
        const recentYear = games[games.length - 1].year;
        return Number(recentYear) > 2017;
    });
    const updatedActives = await updatePlayerPhotos(activePlayers);
    await updateMeta({
        input: {
            id: '_metadata',
            activePlayers: JSON.stringify(updatedActives),
        },
    });
}

/**
 * Sync up active or inactive players if it gets out of sync
 */
async function updatePlayerPhotos(players) {
    const updatedPlayers = asyncForEach(players, async (player) => {
        const games = JSON.parse(player.games);
        const updatedPlayer = {
            id: player.id,
            name: player.name,
            gp: games.length,
        };
        const info = await fetchPlayerInfo(player.id);
        updatedPlayer.photos = info.photos;
        return updatedPlayer;
    });
    return updatedPlayers;
}

/**
 * Update games played for each active player who played in todays game
 * Also updates any inactive players who played in todays game
 * @param {*} actives
 * @param {*} inactives
 * @param {*} players
 */
export function updateActivePlayers(actives, inactives, players) {
    // find player in the current game that is listed in the inactivePlayers list
    const inactivePlayers = findPlayers(inactives, players);
    const updated = actives.map((active) => {
        if (findPlayerById(active.id, players)) {
            return {
                ...active,
                gp: updateGamesPlayed(active.gp),
            };
        }
        return active;
    });
    if (inactivePlayers.length) {
        inactivePlayers.forEach((inactive) => {
            updated.push({
                ...inactive,
                gp: updateGamesPlayed(inactive.gp),
            });
        });
    }
    return updated;
}

export function updateAllFields(allFields, currentGame) {
    // TODO: use regex to find field in metadata
    // Gellert Park should be recorded as Gellert
    // make sure currentGame.field first letter is capitalized
    return { ...allFields, [currentGame.field]: currentGame.field };
}

export function updateAllYears(allYears, currentGame) {
    return { ...allYears, [currentGame.year]: currentGame.year };
}

/**
 * Find and remove current game players from inactive list
 * @param {*} inactives
 * @param {*} players - current game players
 */
export function updateInactivePlayers(inactives, players) {
    return inactives.filter((player) => !findPlayerById(player.id, players));
}

export function updateFieldsMonthsPerYear(perYear, currentGame) {
    const { year, month, field } = currentGame;
    let currentYear;
    if (perYear[year]) {
        currentYear = { ...perYear[year] };
        currentYear.gp += 1;
        currentYear.months = currentYear.months.includes(month)
            ? [...currentYear.months]
            : [...currentYear.months, month];
        currentYear.fields = currentYear.fields[field]
            ? { ...currentYear.fields, [field]: currentYear.fields[field] + 1 }
            : { ...currentYear.fields, [field]: 1 };
    } else {
        currentYear = {
            gp: 1,
            months: [month],
            fields: {
                [field]: 1,
            },
        };
    }
    return { ...perYear, [year]: currentYear };
}

export function updateRecentGames(recentGames, currentGame) {
    return [currentGame, ...recentGames]
        .map((game) =>
            pick(game, ['id', 'name', 'date', 'field', 'month', 'time', 'timeStamp', 'year']),
        )
        .slice(0, 5);
}
