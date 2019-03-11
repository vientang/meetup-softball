const definitions = {
    // write definitions for stats using key/value pairs. These will be seen on // stats table
    rc: {
        basic:
            'Runs Created. Uses offensive stats (including steal attempts) to estimate the actual runs created by a player',
        detail: `In a game where steals are allowed, this is our best stat for offensive production. Formula:
            Runs Created = (hits + walks - caught stealing) * (total bases + stolen bases * 0.55)) / (at bats + walks)`,
    },
    woba: {
        basic:
            'Weighted On Base Average. Considers on base skills and power hitting to measure offensive production',
        detail: `In a game without steals, this is our best stat to measure offensive production. Formula:
            wOBA = (0.690×BB + 0.888×1B + 1.271×2B + 1.616×3B + 2.101×HR) / (at bats + walks + sacrifice flies )`,
    },
    obp: {
        basic: 'On Base Percentage',
        detail: 'Percentage of times reached base safely without making an out',
    },
    ops: {
        basic: 'On Base Plus Slugging',
        detail:
            'On Base Percentage + Slugging Percentage. Good simple stat for performance at the plate',
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
        detail: 'Total Bases = Singles x 1 + Doubles x 2 + Triples x 3 + Home Runs x 4',
    },
};
const qualifiers = ' game minium';

const cardTitles = [
    { name: 'Home Runs', abbr: 'hr' },
    { name: 'Average', abbr: 'avg' },
    // { name: 'Winning Percentage', abbr: 'wp' },
    { name: 'Runs Created', abbr: 'rc' },
    { name: 'Runs Batted In', abbr: 'rbi' },
    { name: 'Runs', abbr: 'r' },
    { name: 'Doubles', abbr: 'doubles' },
    { name: 'Triples', abbr: 'triples' },
    { name: 'Stolen Bases', abbr: 'sb' },
    { name: 'OPS', abbr: 'ops' },
    { name: 'wOBA', abbr: 'woba' },
];
export { definitions, qualifiers, cardTitles };
