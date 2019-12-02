import {
    createNewSummarizedStats,
    fetchSummarizedStats,
    updateExistingSummarizedStats,
} from './apiService';
import { asyncForEach, findPlayerById, getIdFromFilterParams } from './helpers';
import { calculateTotals } from './statsCalc';

export default {
    save: async ({ year, month, field }, stats) => {
        const ids = getSummarizedIds({ year, month, field });
        const summarized = await getSummarizedStats(ids);
        const finalStats = mergeSummarizedStats(stats, summarized, ids);
        console.log('Summarized', { stats, ids, summarized, finalStats });
        // await submitSummarizedStats(finalStats);
    },
};

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

export async function getSummarizedStats(ids) {
    const summarizedStats = {};
    await asyncForEach(ids, async (id) => {
        const stats = await fetchSummarizedStats(id);
        summarizedStats[id] = stats;
    });
    return summarizedStats;
}

export function mergeSummarizedStats(stats, summarized) {
    const newEntries = {};

    Object.keys(summarized).forEach((id) => {
        if (summarized[id]) {
            stats.forEach((player) => {
                const currentStats = player.games[0];
                const existingStats = findPlayerById(player.id, summarized[id]);
                const updatedStats = calculateTotals(existingStats, currentStats);
                if (!existingStats) {
                    // const playerStats = omit(currentStats, gameProperties);
                    // TODO: run calculateTotals to get rate stats
                    const playerEntry = {
                        ...updatedStats,
                        id: player.id,
                        name: player.name,
                    };
                    newEntries[id] = [playerEntry, ...summarized[id]];
                } else {
                    updatedStats.id = player.id;
                    updatedStats.name = player.name;
                    newEntries[id] = summarized[id].map((summarizedPlayer) => {
                        if (summarizedPlayer.id === updatedStats.id) {
                            return updatedStats;
                        }
                        return summarizedPlayer;
                    });
                }
            });
        } else {
            newEntries[id] = stats;
        }
    });
    return newEntries;
}

export async function submitSummarizedStats(stats) {
    console.log('submitSummarizedStats', { stats });
    // stats.forEach(async (entry) => {
    //     try {
    //         if (entry) {
    //             await updateExistingSummarizedStats({
    //                 input: { id: entry.id },
    //                 stats: JSON.stringify(entry.stats),
    //             });
    //         } else {
    //             // summarized record does not yet exist in database
    //             const newRecord = {
    //                 id: entry.id,
    //                 stats: JSON.stringify(entry.stats),
    //             };
    //             await createNewSummarizedStats({ input: newRecord });
    //         }
    //     } catch (e) {
    //         throw new Error(`Error saving summarized stats for ${entry.id}: ${e}`);
    //     }
    // });
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

    const allPlayers = findDifference(summarizedStats);
    const mergedPlayerStats = mergeDifferences(allPlayers);

    updateSummarized({
        input: {
            id,
            stats: JSON.stringify(mergedPlayerStats),
        },
    });
}

function mergeDifferences(players) {
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

function findDifference(stats) {
    return stats.reduce((acc, curr) => {
        if (!acc[curr.id]) {
            acc[curr.id] = [curr];
        } else {
            acc[curr.id].push(curr);
        }
        return acc;
    }, {});
}

async function updateSummarized(input) {
    await updateExistingSummarizedStats(input);
}
