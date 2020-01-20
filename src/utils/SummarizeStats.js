import pick from 'lodash/pick';
import {
    createNewSummarizedStats,
    fetchSummarizedStats,
    updateExistingSummarizedStats,
} from './apiService';
import { asyncForEach, findPlayerById, getIdFromFilterParams } from './helpers';
import { calculateTotals, calculateNewPlayerStats } from './statsCalc';
import createLeaderBoard from './leadersCalc';

export default {
    save: async ({ year, month, field } = {}, stats, metadata) => {
        const preSummarized = await getSummarizedStats({ year, month, field });
        const players = flatStats(stats);
        // merge current stats with summarized stats
        const postSummarized = mergeSummarizedStats(preSummarized, players);
        const leaderboard = createLeaderBoard(postSummarized[`_${year}`], metadata, year);
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
 * @param {Array} players [{ id, name, games: [{}] }, ...]
 * @return {Array} [{ id, name, singles, hr, ... }]
 */
export function flatStats(players) {
    return players.map((player) => {
        const stats = pick(player.games[0], [
            'ab',
            'avg',
            'bb',
            'cs',
            'doubles',
            'gp',
            'h',
            'hr',
            'k',
            'l',
            'o',
            'obp',
            'ops',
            'r',
            'rbi',
            'rc',
            'sac',
            'sb',
            'singles',
            'slg',
            'tb',
            'triples',
            'w',
            'woba',
        ]);
        return { id: player.id, name: player.name, ...stats };
    });
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
