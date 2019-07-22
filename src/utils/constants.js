const definitions = {
    // write definitions for stats using key/value pairs. These will be seen on // stats table
    rc: {
        basic: 'Runs Created',
        detail:
            'Uses offensive stats (including steal attempts) to estimate the actual runs created by a player. In a game where steals are allowed, this is our best stat for offensive production.',
        formula:
            '(hits + walks - caught stealing) * (total bases + stolen bases * 0.55)) / (at bats + walks)',
    },
    woba: {
        basic: 'Weighted On Base Average',
        detail:
            'Considers on base skills and power hitting to measure offensive production. In a game without steals, this is our best stat to measure offensive production.',
        formula:
            '(0.690×BB + 0.888×1B + 1.271×2B + 1.616×3B + 2.101×HR) / (at bats + walks + sacrifice flies )',
    },
    obp: {
        basic: 'On Base Percentage',
        detail: 'Percentage of times reached base safely without making an out',
        formula: '(hits + walks) / (atBats + walks + sacrifices)',
    },
    ops: {
        basic: 'On Base Plus Slugging',
        detail: 'Good simple stat for performance at the plate',
        formula: 'On Base Percentage + Slugging Percentage.',
    },
    gp: {
        basic: 'Games Played',
        detail: 'Games Played',
    },
    ab: {
        basic: 'At Bats',
        detail: 'At Bats that result in hit or out. Does not include walks or sacrifices',
    },
    h: {
        basic: 'Hits',
        detail: 'Hits (Can only be single, double, triple, or home run',
    },
    '1b': {
        basic: 'Singles',
        detail: 'Doubles',
    },
    '2b': {
        basic: 'Doubles',
        detail: 'Doubles',
    },
    '3b': {
        basic: 'Triples',
        detail: 'Triples',
    },
    r: {
        basic: 'Runs Scored',
        detail: 'Runs Scored',
    },
    rbi: {
        basic: 'Runs Batted In',
        detail: 'Runs Batted In',
    },
    hr: {
        basic: 'Home Runs',
        detail: 'Dingers',
    },
    avg: {
        basic: 'Batting Average',
        detail: 'Hits / At Bats',
    },
    sb: {
        basic: 'Stolen Bases',
        detail: 'Stolen Bases',
    },
    cs: {
        basic: 'Caught Stealing',
        detail: 'Times caught stealing',
    },
    bb: {
        basic: 'Walks',
        detail: ' Walks / bases on balls',
    },
    k: {
        basic: 'Strikeouts',
        detail: 'Strikeouts - includes foul outs',
    },
    tb: {
        basic: 'Total Bases',
        detail: 'Total amount of bases reached.',
        formula: 'Singles x 1 + Doubles x 2 + Triples x 3 + Home Runs x 4',
    },
};

const qualifiers = 'game minimum';

const cardTitles = [
    { name: 'Home Runs', abbr: 'hr' },
    { name: 'Average', abbr: 'avg' },
    { name: 'Runs Created', abbr: 'rc' },
    { name: 'Runs Batted In', abbr: 'rbi' },
    { name: 'Runs', abbr: 'r' },
    { name: 'Doubles', abbr: 'doubles' },
    { name: 'Triples', abbr: 'triples' },
    { name: 'Stolen Bases', abbr: 'sb' },
    { name: 'OPS', abbr: 'ops' },
    { name: 'wOBA', abbr: 'woba' },
    // { name: 'Winning Percentage', abbr: 'wp' },
];

const defaultStatCategories = [
    '',
    'gp',
    'h',
    'singles',
    'doubles',
    'triples',
    'r',
    'rbi',
    'hr',
    'avg',
    'sb',
    'cs',
    'bb',
    'sac',
    'k',
    'rc',
    'tb',
];

const statPageCategories = [
    'player',
    'gp',
    'ab',
    'h',
    'singles',
    'doubles',
    'triples',
    'hr',
    'avg',
    'r',
    'rbi',
    'sb',
    'cs',
    'bb',
    'sac',
    'k',
    'rc',
    'tb',
    'obp',
    'ops',
    'slg',
    'woba',
];

const gameLogCategories = [
    'date',
    'game',
    'battingOrder',
    'ab',
    'h',
    'singles',
    'doubles',
    'triples',
    'hr',
    'r',
    'rbi',
    'sb',
    'cs',
    'bb',
    'sac',
    'k',
];

const adminStatCategories = [
    'battingOrder',
    'player',
    'o',
    'singles',
    'doubles',
    'triples',
    'hr',
    'bb',
    'sb',
    'cs',
    'k',
    'rbi',
    'r',
    'sac',
];

const careerStatCatsByYear = [
    'season',
    'gp',
    'w',
    'h',
    'singles',
    'doubles',
    'triples',
    'r',
    'rbi',
    'hr',
    'avg',
    'sb',
    'cs',
    'bb',
    'sac',
    'k',
    'rc',
    'tb',
    'obp',
    'ops',
    'slg',
    'woba',
];

const careerStatCatsByField = [
    'field',
    'gp',
    'w',
    'h',
    'singles',
    'doubles',
    'triples',
    'r',
    'rbi',
    'hr',
    'avg',
    'sb',
    'cs',
    'bb',
    'sac',
    'k',
    'rc',
    'tb',
    'obp',
    'ops',
    'slg',
    'woba',
];

const splitStatCategories = [
    'gp',
    'w',
    'h',
    'singles',
    'doubles',
    'triples',
    'r',
    'rbi',
    'hr',
    'avg',
    'sb',
    'cs',
    'bb',
    'sac',
    'k',
    'rc',
    'tb',
    'obp',
    'ops',
    'slg',
    'woba',
];

const gameProperties = [
    'date',
    'field',
    'lat',
    'lon',
    'month',
    'name',
    'time',
    'timeStamp',
    'tournamentName',
    'year',
];

const playerProfileKeys = [
    'id',
    'meetupId',
    'name',
    'admin',
    'gender',
    'joined',
    'key',
    'photos',
    'profile',
    'status',
];

export {
    adminStatCategories,
    careerStatCatsByField,
    careerStatCatsByYear,
    cardTitles,
    defaultStatCategories,
    definitions,
    gameLogCategories,
    gameProperties,
    playerProfileKeys,
    qualifiers,
    splitStatCategories,
    statPageCategories,
};
