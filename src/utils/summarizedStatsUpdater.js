import { updateExistingSummarizedStats } from './apiService';
import { calculateTotals } from './statsCalc';

// Utility to make corrections to SummarizedStats

// eslint-disable-next-line import/prefer-default-export
export function updateSummarizedStats(stats, id) {
    let summarizedStats = stats;
    if (typeof stats === 'string') {
        summarizedStats = JSON.parse(stats);
    }

    const allPlayers = findDifference(summarizedStats);
    const mergedPlayerStats = mergeDifferences(allPlayers);

    submitSummarized({
        input: {
            // eslint-disable-next-line prettier/prettier
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

async function submitSummarized(input) {
    await updateExistingSummarizedStats(input);
}
