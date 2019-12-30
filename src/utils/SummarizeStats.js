import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import {
    createNewSummarizedStats,
    fetchSummarizedStats,
    updateExistingSummarizedStats,
} from './apiService';
import { asyncForEach, findPlayerById, getIdFromFilterParams } from './helpers';
import { calculateTotals } from './statsCalc';
import createLeaderBoard from './leadersCalc';

export default {
    save: async ({ year, month, field } = {}, players) => {
        // get summarized stats without duplicates
        const summarized = await getSummarizedStats({ year, month, field });
        const cleanSummarized = resolveDuplicateEntries(summarized);

        // merge current stats with summarized stats
        const finalSummarized = mergeSummarizedStats(players, cleanSummarized);

        // calculate leaderboards
        finalSummarized[`_leaderboard_${year}`] = createLeaderBoard(finalSummarized[`_${year}`]);

        // diff the players stats
        // const currentSummary = cleanSummarized[`_${year}`].filter((entry) =>
        //     players.some((player) => player.id === entry.id),
        // );
        // const finalSummary = finalSummarized[`_${year}`].filter((entry) =>
        //     players.some((player) => player.id === entry.id),
        // );

        await submitSummarizedStats(finalSummarized);
    },
    saveLegacy: async (summarized) => {
        const legacySummarized = { ...summarized };
        const leaders2019 = await createLeaderBoard(legacySummarized._2019);
        legacySummarized._leaderboard_2019 = leaders2019;
        await submitSummarizedStats(legacySummarized);
    },
};

export async function getSummarizedStats({ year, month, field } = {}) {
    const ids = getSummarizedIds({ year, month, field });

    const summarizedStats = {};
    await asyncForEach(ids, async (id) => {
        const stats = await fetchSummarizedStats(id);
        summarizedStats[id] = stats;
    });

    return summarizedStats;
}

/**
 *
 * @param {*} players [{ id, name, games: [{}] }, { id, name, games: [{}] }, ...]
 * @param {*} summarized { _2019: [{}], _2019_12: [{}] }
 * @return {Object} { _2019: [{}, {}, ...], _2019_12: [{}, {}, ...], _12_alta_loma: null }
 */
export function mergeSummarizedStats(players, summarized) {
    const summarizedStats = cloneDeep(summarized);
    Object.keys(summarizedStats).forEach((key) => {
        const stats = summarizedStats[key];
        if (key === '_leaderboard_2019') {
            return;
        }
        if (stats) {
            summarizedStats[key] = updateExistingSummarizedPlayers(stats, players);
        } else {
            // first time calculating summarized stats for this field
            summarizedStats[key] = createSummarizedPlayers(players);
        }
    });
    return summarizedStats;
}

export function getSummarizedIds({ year, month, field } = {}) {
    const yearId = getIdFromFilterParams({ year });
    const leaderboardId = `_leaderboard${yearId}`;
    const yearMonthId = getIdFromFilterParams({ year, month });
    const yearMonthFieldId = getIdFromFilterParams({ year, month, field });
    const yearFieldId = getIdFromFilterParams({ year, field });
    const monthId = getIdFromFilterParams({ month });
    const monthFieldId = getIdFromFilterParams({ month, field });
    const fieldId = getIdFromFilterParams({ field });
    return [
        yearId,
        yearMonthId,
        yearMonthFieldId,
        yearFieldId,
        monthId,
        monthFieldId,
        fieldId,
        leaderboardId,
    ];
}

function updateExistingSummarizedPlayers(stats, players) {
    return stats.map((statEntry) => {
        const { id, name } = statEntry;
        const playerStats = findPlayerById(id, players);
        if (playerStats) {
            const updatedStats = calculateTotals(statEntry, playerStats.games[0]);
            return { id, name, ...updatedStats };
        }
        return { id, name, ...statEntry };
    });
}

function createSummarizedPlayers(players) {
    return players.map((player) => ({ id: player.id, name: player.name, ...player.games[0] }));
}

export async function submitSummarizedStats(stats) {
    Object.keys(stats).forEach(async (id) => {
        const summarizedStats = JSON.stringify(stats[id]);
        const exists = await fetchSummarizedStats(id);
        try {
            if (exists) {
                await updateExistingSummarizedStats({
                    input: {
                        id,
                        stats: summarizedStats,
                    },
                });
            } else {
                // summarized record does not yet exist in database
                await createNewSummarizedStats({
                    input: {
                        id,
                        stats: summarizedStats,
                    },
                });
            }
        } catch (e) {
            throw new Error(`Error saving stats for ${id}: `, e);
        }
    });
}

/**
 * SummarizedStats might have multiple entries for the same player
 * These functioms will combine multiple entries into one
 * @param {Object} stats - pre-summarized stats that should be corrected
 * @param {String} id - id of the summarized record i.e. _2019_01
 */
export function resolveMultiples(stats, id) {
    let summarizedStats = stats;
    if (typeof stats === 'string') {
        summarizedStats = JSON.parse(stats);
    }

    const allPlayers = collectMultipleEntries(summarizedStats);
    const mergedPlayerStats = mergeMultipleEntries(allPlayers);

    updateSummarized({
        input: {
            id,
            stats: JSON.stringify(mergedPlayerStats),
        },
    });
}

/**
 * Reduce each players entries into one
 * Note: most players will have only one entry
 * @param {Object} players
 */
function mergeMultipleEntries(players) {
    return Object.keys(players).map((playerId) => {
        const values = players[playerId];
        return values.reduce((acc, currGame) => {
            if (values.length === 1) {
                return currGame;
            }
            return { ...calculateTotals(acc, currGame), id: playerId, name: currGame.name };
        }, {});
    });
}

/**
 * Build a map of all players by id
 * Collected all games for each player and save to a list
 * Looking for more than one game per player means there are multiple entries for the same player
 * @param {Array} stats
 */
function collectMultipleEntries(stats) {
    return stats.reduce((acc, entry) => {
        if (!acc[entry.id]) {
            acc[entry.id] = [entry];
        } else {
            acc[entry.id].push(entry);
        }
        return acc;
    }, {});
}

async function updateSummarized(input) {
    await updateExistingSummarizedStats(input);
}

/**
 * Functions below resolve duplicate entries in any of the keys in summarized stats.
 * Note, might be redundant with resolveMultiples, mergeMultipleEntries and collectMultipleEntries
 */

/**
 * Find duplicate entries in summarized stats and merge into one entry
 * @param {*} summarized
 */
function resolveDuplicateEntries(summarized) {
    const merged = {};
    let duplicatePlayerIds = [];
    Object.keys(summarized).forEach((key) => {
        const stats = summarized[key];
        // summarized contains three possible values - Array, Object (leaderboard) or null
        if (stats && Array.isArray(stats)) {
            const duplicates = findDuplicates(stats, key);
            if (!isEmpty(duplicates)) {
                merged[key] = duplicates;
                duplicatePlayerIds = Object.keys(duplicates).map((id) => id);
            }
        }
    });

    Object.keys(merged).forEach((mergedKey) => {
        summarized[mergedKey].forEach((player) => {
            if (duplicatePlayerIds.includes(player.id)) {
                const existingStats = merged[mergedKey][player.id][0];
                const currentStats = merged[mergedKey][player.id][1];

                if (existingStats && currentStats) {
                    merged[mergedKey][player.id] = {
                        ...calculateTotals(existingStats, currentStats),
                        id: player.id,
                        name: player.name,
                    };
                }
            }
        });
    });

    return mergeDuplicatesWithSummarized(summarized, merged);
}

function mergeDuplicatesWithSummarized(summarized, duplicates) {
    const duplicateKeys = Object.keys(duplicates);
    let stats;
    let duplicatePlayerIds;
    let duplicatePlayers;
    duplicateKeys.forEach((dupeKey) => {
        stats = [...summarized[dupeKey]];
        duplicatePlayers = duplicates[dupeKey];
        duplicatePlayerIds = Object.keys(duplicates[dupeKey]);
    });

    stats = stats.filter((stat) => !duplicatePlayerIds.includes(stat.id));
    Object.keys(duplicatePlayers).forEach((dupeKey) => {
        stats.push(duplicatePlayers[dupeKey]);
    });

    return { ...summarized, [duplicateKeys[0]]: stats };
}

function findDuplicates(summarized) {
    const holdingTank = {};
    const duplicates = {};
    summarized.forEach((value) => {
        if (!holdingTank[value.id]) {
            // use holding tank to detect duplicates
            holdingTank[value.id] = value;
        } else if (duplicates[value.id]) {
            // already have seen this player
            duplicates[value.id].push(value);
        } else {
            // first time seeing any duplicate players
            // remember to include the previous value in the holding tank
            duplicates[value.id] = [holdingTank[value.id], value];
        }
    });
    return duplicates;
}
