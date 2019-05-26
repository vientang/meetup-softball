import statsCalc from './statsCalc';

const {
    getAtBats,
    getAverage,
    getHits,
    getOnBasePercentage,
    getOPS,
    getSlugging,
    getTotalBases,
    getWOBA,
    getRunsCreated,
} = statsCalc;

export function createSlug(name) {
    return name
        .split(' ')
        .join('_')
        .toLowerCase();
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

/**
 * Remove leading zero, append zeroes or convert to zero
 * @param {String} value
 */
export function formatCellValue(value) {
    const formattedValue = value || '';
    if (formattedValue.substring(0, 2) === '0.') {
        return formatValueLength(formattedValue.slice(1), 4);
    }
    if (Number(formattedValue[0]) > 0 && formattedValue[1] === '.') {
        return formatValueLength(formattedValue, 4);
    }
    return value || 0;
}

export function setTopLeaders(players, stat) {
    // return an array of 5 objects
    // describing the player name and their stat total
    let topLeaders = [];
    let comparison = [];
    let total;
    players.forEach((element) => {
        const playerName = element.name;

        // switch on woba/obp/ops/avg to do either rate or counting stat
        switch (stat) {
            case 'avg':
            case 'obp':
            case 'ops':
            case 'woba':
                total = getRateStatTotal(element.games, stat);
                break;
            case 'rc':
                total = getRunsCreatedTotal(element.games);
                break;
            default:
                total = getCountingStatTotal(element.games, stat);
                break;
        }
        comparison.push({ playerName, total });
    });

    comparison = comparison.sort((a, b) => (a.total > b.total ? -1 : 1));

    topLeaders = comparison.slice(0, 5);

    // is there a tie for the 5th spot?
    comparison.slice(5).some((player) => {
        if (player.total === topLeaders[4].total) {
            topLeaders.push(player);
            return false;
        }
        return true;
    });
    return topLeaders;
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

/**
 * Combine multiple functions into one
 */
const chainedFunc = (...funcs) =>
    funcs
        .filter((f) => f != null)
        .reduce((acc, f) => {
            if (typeof f !== 'function') {
                throw new Error(
                    'Invalid Argument Type, must only provide functions, undefined, or null.',
                );
            }
            if (acc === null) {
                return f;
            }
            return function chainedFunction(...args) {
                acc.apply(this, args);
                f.apply(this, args);
            };
        }, null);
/** ***************************** END OF PRIVATE FUNCTIONS ***************************** */

export default {
    chainedFunc,
    formatCellValue,
    getRateStatTotal,
    getRunsCreatedTotal,
    sortByNameLength,
    sortHighToLow,
    sortTimeStamp,
};