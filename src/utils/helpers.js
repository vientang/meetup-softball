import { API, graphqlOperation } from 'aws-amplify';
import get from 'lodash/get';
import { getPlayerStats, listGameStatss, listPlayerStatss } from '../graphql/queries';
import {
    getAtBats,
    getAverage,
    getHits,
    getOnBasePercentage,
    getOPS,
    getSlugging,
    getTotalBases,
    getWOBA,
    getRunsCreated,
} from './statsCalc';

export async function fetchPlayer(id) {
    const existingPlayer = await API.graphql(graphqlOperation(getPlayerStats, { id }));
    return get(existingPlayer, 'data.getPlayerStats', null);
}

const players = [];
export async function fetchAllPlayers(queryParams = {}) {
    const fetchedPlayers = await API.graphql(graphqlOperation(listPlayerStatss, queryParams));
    const { items, nextToken } = fetchedPlayers.data.listPlayerStatss;
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

export function createSlug(name) {
    let slug = name
        .split(' ')
        .join('_')
        .toLowerCase();

    if (slug.charAt(slug.length - 1) === '.') {
        slug = slug.slice(0, slug.length - 1);
    }

    return slug;
}

export function getMeridiem(time) {
    if (time) {
        return Number(time.substring(0, 2)) < 12 ? 'am' : 'pm';
    }
    return '';
}

export function getDefaultSortedColumn(id, desc) {
    return [{ id, desc }];
}

export function sortByNameLength(a, b) {
    if (a.length === b.length) {
        return a > b ? 1 : -1;
    }
    return a.length > b.length ? 1 : -1;
}

export function sortHighToLow(a, b) {
    return Number(a) < Number(b) ? 1 : -1;
}

export function sortTimeStamp(a, b) {
    return Number(a.timeStamp) < Number(b.timeStamp) ? 1 : -1;
}

export function convertStringStatsToNumbers(stats) {
    const { ab, r, singles, doubles, triples, hr, rbi, bb, k, sac, sb } = stats;
    return {
        ab: Number(ab),
        r: Number(r),
        singles: Number(singles),
        doubles: Number(doubles),
        triples: Number(triples),
        hr: Number(hr),
        rbi: Number(rbi),
        bb: Number(bb),
        k: Number(k),
        sac: Number(sac),
        sb: Number(sb),
    };
}

/**
 * Format cell value to 4 decimal points
 * 0.567 becomes .567 || 1.234567 becomes 1.234 || 0.8 becomes .800
 * @param {String} value
 */
export function formatCellValue(value) {
    if (value === null) {
        return '0';
    }

    const formattedValue = value.toString() || '';

    if (formattedValue.includes('.')) {
        // remove leading zero
        if (formattedValue.substring(0, 2) === '0.') {
            return formatValueLength(formattedValue.slice(1), 4);
        }
        // add trailing zeroes or remove to 4 digits
        // leading number is greater than 0
        if (Number(formattedValue[0]) > 0 && formattedValue[1] === '.') {
            return formatValueLength(formattedValue, 4);
        }
        // add trailing zeroes or remove to 5 digits
        // leading number is greater than 9
        return formatValueLength(formattedValue, 5);
    }

    return formattedValue || '0';
}

/** ***************************** PRIVATE FUNCTIONS ***************************** */
function formatValueLength(value, max) {
    if (!value.includes('.')) {
        return value;
    }

    if (value.length > max) {
        return value.slice(0, max);
    }

    let formattedValue = value;
    while (formattedValue.length < max) {
        formattedValue += '0';
    }

    return formattedValue;
}

// Loop through all players
// Calculate their counting stat totals
// Check if it belongs in the top 5
// If yes, save the player name and stat total
// If no, don't save
function getCountingStatTotal(games, statToCount) {
    return games.reduce((acc, cur) => {
        let total = acc;
        if (typeof cur[statToCount] === 'number') {
            total += cur[statToCount];
        } else {
            total += 0;
        }
        return total;
    }, 0);
}

function getRunsCreatedTotal(games) {
    const hits = getHits(
        getCountingStatTotal(games, 'singles'),
        getCountingStatTotal(games, 'doubles'),
        getCountingStatTotal(games, 'triples'),
        getCountingStatTotal(games, 'hr'),
    );

    const atBats = getAtBats(hits, getCountingStatTotal(games, 'o'));
    const totalBases = getTotalBases(
        getCountingStatTotal(games, 'singles'),
        getCountingStatTotal(games, 'doubles'),
        getCountingStatTotal(games, 'triples'),
        getCountingStatTotal(games, 'hr'),
    );

    return getRunsCreated(
        hits,
        getCountingStatTotal(games, 'bb'),
        getCountingStatTotal(games, 'cs'),
        totalBases,
        getCountingStatTotal(games, 'sb'),
        atBats,
    );
}

function getRateStatTotal(games, statToCount) {
    // switch case for each rate stat and calculate for setTopLeaders
    // think about how to involve getCountingStatTotal
    // test in utils.test.js
    const hits = getHits(
        getCountingStatTotal(games, 'singles'),
        getCountingStatTotal(games, 'doubles'),
        getCountingStatTotal(games, 'triples'),
        getCountingStatTotal(games, 'hr'),
    );

    // do you need to call getCountingStatTotal on all games.xxx instances?

    const atBats = getAtBats(hits, getCountingStatTotal(games, 'o'));

    switch (statToCount) {
        case 'avg':
            return getAverage(hits, atBats);
        case 'obp':
            return getOnBasePercentage(
                hits,
                getCountingStatTotal(games, 'bb'),
                atBats,
                getCountingStatTotal(games, 'sac'),
            );
        case 'ops':
            return getOPS(
                getOnBasePercentage(
                    hits,
                    getCountingStatTotal(games, 'bb'),
                    atBats,
                    getCountingStatTotal(games, 'sac'),
                ),
                getSlugging(
                    getTotalBases(
                        getCountingStatTotal(games, 'singles'),
                        getCountingStatTotal(games, 'doubles'),
                        getCountingStatTotal(games, 'triples'),
                        getCountingStatTotal(games, 'hr'),
                    ),
                    atBats,
                ),
            );

        case 'woba':
            return getWOBA(
                getCountingStatTotal(games, 'bb'),
                getCountingStatTotal(games, 'singles'),
                getCountingStatTotal(games, 'doubles'),
                getCountingStatTotal(games, 'triples'),
                getCountingStatTotal(games, 'hr'),
                atBats,
                getCountingStatTotal(games, 'sac'),
            );
        default:
            return 0;
    }
}

/** ***************************** END OF PRIVATE FUNCTIONS ***************************** */

export default {
    formatCellValue,
    getRateStatTotal,
    getRunsCreatedTotal,
    sortByNameLength,
    sortHighToLow,
    sortTimeStamp,
};
