export async function asyncForEach(array, callback) {
    const results = [];
    for (let index = 0; index < array.length; index += 1) {
        // await callback(array[index], index, array);
        results.push(callback(array[index], index, array));
    }
    return Promise.all(results);
}

/**
 * Schema matching GameStats
 * Adaptor to create game object from meetup data and admin stats
 * tested
 * @param {Object} player
 */
export function createGame(game) {
    const { id, local_date, local_time, rsvp_limit, time, venue, waitlist_count } = game;

    const gameDate = new Date(time).toDateString();
    const [year, month] = local_date.split('-');
    const { lat, lon, name } = venue;
    const gameId = game.name.split(' ')[1];

    const newGame = {};
    newGame.date = gameDate;
    newGame.field = name;
    newGame.gameId = gameId;
    newGame.lat = lat;
    newGame.lon = lon;
    newGame.id = id;
    newGame.month = month;
    newGame.name = game.name;
    newGame.rsvps = rsvp_limit;
    newGame.time = local_time;
    newGame.timeStamp = time;
    newGame.tournamentName = game.name;
    newGame.waitListCount = waitlist_count;
    newGame.year = year;

    return newGame;
}

/**
 * Create player object from game rsvps for admin page
 * @param {Object} player
 */
export function createPlayer(player) {
    const { name, id, joined, group_profile, is_pro_admin, photo, status } = player.data;
    return {
        id,
        name,
        joined,
        status,
        profile: group_profile,
        admin: is_pro_admin,
        photos: photo,
        singles: null,
        doubles: null,
        triples: null,
        bb: null,
        cs: null,
        hr: null,
        k: null,
        o: null,
        r: null,
        rbi: null,
        sac: null,
        sb: null,
    };
}

// tested
export function buildFilterMenu(filters, metadata) {
    const { year } = filters;
    const options = JSON.parse(metadata.perYear);
    const years = Object.keys(options);
    const { fields, months } = options[year];
    return {
        fields: Object.keys(fields),
        years: years.sort(sortHighToLow),
        months,
    };
}

/**
 * Creates an object with properties that match the specified key.
 * @param {Array} values
 * @param {String} key
 */
export function mapByKey(values, key) {
    return values.reduce((acc, value) => {
        if (acc[value[key]]) {
            acc[value[key]].push(value);
        } else {
            acc[value[key]] = [];
            acc[value[key]].push(value);
        }
        return acc;
    }, {});
}

export function findCurrentGame(selectedGameId) {
    return (game) => game.id === selectedGameId;
}

export function filterCurrentGame(selectedGameId) {
    return (game) => game.id !== selectedGameId;
}

// tested
export function getFieldName(field = '', allFields) {
    const currentField = field.toLowerCase();
    const existingField = Object.values(allFields).find((fieldName) =>
        currentField.includes(fieldName.toLowerCase()),
    );
    return existingField || currentField;
}

// tested
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

export function parseCurrentYear(date) {
    return date.split('/')[2];
}

export function parseCurrentMonth(date) {
    return date.split('/')[0];
}

/**
 * Parse the profile and photos object from meetup
 * tested
 * @param {Object} players
 * @return {Object}
 */
export function parsePhotosAndProfile(player) {
    return {
        photos: player.photos ? JSON.parse(player.photos) : {},
        profile: player.profile ? JSON.parse(player.profile) : {},
    };
}

// tested
export function getMeridiem(time) {
    if (time) {
        return Number(time.substring(0, 2)) < 12 ? 'am' : 'pm';
    }
    return '';
}

// tested
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
    const first = typeof a === 'undefined' ? 0 : a;
    const second = typeof b === 'undefined' ? 0 : b;
    return Number(first) < Number(second) ? 1 : -1;
}

export function sortTimeStamp(a, b) {
    return Number(a.timeStamp) < Number(b.timeStamp) ? 1 : -1;
}

export function sortByYear(a, b) {
    return Number(a.year) < Number(b.year) ? 1 : -1;
}

// tested
export function convertStatsForTable(stats) {
    if (!stats) {
        return null;
    }
    if (Array.isArray(stats)) {
        return stats;
    }
    return Object.values(stats);
}

// tested
export function convertStringStatsToNumbers(stats) {
    const { ab, r, singles, doubles, triples, hr, rbi, bb, k, sac, sb, cs, gp, w, l, o } = stats;
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
        cs: Number(cs),
        gp: Number(gp),
        w: Number(w),
        l: Number(l),
        o: Number(o),
    };
}

/**
 * Lookup player in an array or object
 * Normalizes the id before comparing
 * @param {Number || String} id
 * @param {Array || Object} players
 * tested
 */
export function findPlayerById(id, players) {
    if (!id || !players) {
        return null;
    }
    if (Array.isArray(players)) {
        return players.find((player) => Number(player.id) === Number(id));
    }
    return players[id];
}

// tested
export function serializeStats(stats) {
    if (!stats || typeof stats !== 'object') {
        return null;
    }
    return JSON.stringify(stats);
}

// tested
export function parseStats(stats) {
    if (Array.isArray(stats)) {
        return stats;
    }

    if (!stats || typeof stats !== 'string') {
        return null;
    }

    const isArray = typeof stats === 'string' && stats[0] === '[';
    const isObject = typeof stats === 'string' && stats[0] === '{';
    if (!isArray && !isObject) {
        return null;
    }

    return JSON.parse(stats);
}

/**
 * Use properties of argument to construct an id
 * Order is important - year > month > field
 * tested
 */
export function getIdFromFilterParams({ year, month, field } = {}) {
    if (!year && !month && !field) {
        return null;
    }
    let id = '';
    if (year) {
        id = `_${year}`;
    }
    if (month) {
        id += `_${month}`;
    }
    if (field) {
        const regexSpace = / /g;
        const fieldTrimmed = field.toLowerCase().replace(regexSpace, '_');
        id += `_${fieldTrimmed}`;
    }
    return id;
}

/**
 * Format cell value to 4 decimal points
 * 0.567 becomes .567 || 1.234567 becomes 1.234 || 0.8 becomes .800
 * tested
 * @param {String} value
 */
export function formatCellValue(value) {
    if (value === null || value === undefined) {
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

/** ***************************** END OF PRIVATE FUNCTIONS ***************************** */
