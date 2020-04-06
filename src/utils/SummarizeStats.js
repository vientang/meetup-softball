import {
    createNewSummarizedStats,
    fetchAllGames,
    fetchSummarizedStats,
    updateExistingSummarizedStats,
} from './apiService';
import { asyncForEach, findPlayerById, getIdFromFilterParams } from './helpers';
import { calculateTotals, calculateNewPlayerStats } from './statsCalc';
import createLeaderBoard from './leadersCalc';

export default {
    save: async ({ year, month, field } = {}, winners, losers, metadata) => {
        const preSummarized = await getSummarizedStats({ year, month, field });
        const players = winners.concat(losers);
        // merge current stats with summarized stats
        const postSummarized = mergeSummarizedStats(preSummarized, players);
        const leaderboard = createLeaderBoard(postSummarized[`_${year}`], metadata.perYear, year);
        // calculate leaderboards
        postSummarized[`_leaderboard_${year}`] = leaderboard;
        await submitSummarizedStats(postSummarized);
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

/**
 * @param {*} summarized { _2019: [{}], _2019_12: [{}], _2020: null }
 * @param {*} players [{ id, name, singles, hr, ... }, { id, name, singles, hr, ... }, ...]
 * @return {Object} { _2019: [{}, {}, ...], _2019_12: [{}, {}, ...], _12_alta_loma: null }
 */
export function mergeSummarizedStats(summarized, players) {
    const summarizedStats = {};
    Object.keys(summarized).forEach((key) => {
        const stats = summarized[key];
        if (key.includes('_leaderboard')) {
            return;
        }
        if (stats) {
            summarizedStats[key] = updateExistingStats(stats, players);
        } else {
            // first time calculating summarized stats for this field
            summarizedStats[key] = createSummarizedStats(players);
        }
    });
    return summarizedStats;
}

export function updateExistingStats(stats, players) {
    const existingPlayers = findExistingPlayers(stats, players);
    const newPlayers = findNewPlayers(stats, players);
    let currentPlayers = findCurrentPlayers(stats, players);
    currentPlayers = updateCurrentPlayerStats(currentPlayers, players);

    // keep existing stats
    // include updated stats
    // add new stats
    return [...existingPlayers, ...currentPlayers, ...newPlayers];
}

/**
 * Find players who did not play in todays game but have existing entries
 * Note: stat values are strings that were serialized in the submission process
 * @param {Array} stats
 * @param {Array} players
 */
export function findExistingPlayers(stats, players) {
    return stats.filter((entry) => !findPlayerById(entry.id, players));
}

/**
 * Find players who played in todays game but do not have existing entries
 * @param {Array} stats
 * @param {Array} players
 */
export function findNewPlayers(stats, players) {
    return players
        .filter((player) => !findPlayerById(player.id, stats))
        .map(calculateNewPlayerStats);
}

/**
 * Find players who played in todays game and have existing entries
 * @param {Array} stats
 * @param {Array} players
 */
export function findCurrentPlayers(stats, players) {
    return stats.filter((entry) => findPlayerById(entry.id, players));
}

/**
 * Update stats for players who played today
 * @param {Array} stats
 * @param {Array} players
 */
export function updateCurrentPlayerStats(stats, players) {
    return stats.reduce((acc, entry) => {
        const { id, name } = entry;
        const currentStats = findPlayerById(id, players);
        acc.push({ id, name, ...calculateTotals(entry, currentStats) });
        return acc;
    }, []);
}

export function createSummarizedStats(players) {
    return players.map(calculateNewPlayerStats);
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

export async function summaryStatsUpdater() {
    const games = await fetchAllGames({ filter: { year: { eq: '2020' } }, limit: 800 });
    const summarized = {};
    games.forEach((game) => {
        const { field, losers, month, winners, year } = game;
        // const leaderboardId = `_leaderboard${yearId}`;
        // const monthId = getIdFromFilterParams({ month });
        // const monthFieldId = getIdFromFilterParams({ month, field });
        // const fieldId = getIdFromFilterParams({ field });
        const yearId = getIdFromFilterParams({ year });
        const yearMonthId = getIdFromFilterParams({ year, month });
        const yearMonthFieldId = getIdFromFilterParams({ year, month, field });
        const yearFieldId = getIdFromFilterParams({ year, field });
        const players = JSON.parse(winners).players.concat(JSON.parse(losers).players);
        [yearId, yearMonthId, yearMonthFieldId, yearFieldId].forEach((summarizedId) => {
            if (summarized[summarizedId]) {
                const stats = [];
                const existing = [...summarized[summarizedId]];
                // add or update current game players
                players.forEach((player) => {
                    const { id, name } = player;
                    if (player.gp === undefined) {
                        player.gp = '1';
                    }
                    const existingPlayer = existing.find((e) => e.id === id);
                    if (existingPlayer) {
                        stats.push({ id, name, ...calculateTotals(existingPlayer, player) });
                    } else {
                        stats.push({ id, name, ...calculateTotals(null, player) });
                    }
                });
                // add back in existing players who didn't play today
                existing.forEach((existingP) => {
                    const playedToday = stats.find((pStat) => pStat.id === existingP.id);
                    if (!playedToday) {
                        stats.push(existingP);
                    }
                });
                summarized[summarizedId] = stats;
            } else {
                summarized[summarizedId] = players.map((player) => {
                    const { id, name } = player;
                    if (player.gp === undefined) {
                        player.gp = '1';
                    }
                    return { id, name, ...calculateTotals(null, player) };
                });
            }
        });
    });
    return summarized;
}
