const StatsMap = {
    singles(value) {
        return value < 10;
    },
    doubles(value) {
        return value < 10;
    },
    triples(value) {
        return value < 10;
    },
    hr(value) {
        return value < 10;
    },
    r(value) {
        return value < 10;
    },
    bb(value) {
        return value < 10;
    },
    sb(value) {
        return value < 10;
    },
    cs(value) {
        return value < 10;
    },
    o(value) {
        return value < 10;
    },
    k(value) {
        return value < 10;
    },
};

export const validStat = (e, id, currentValue) => {
    const value = currentValue ? Number(`${currentValue}${e.key}`) : Number(e.key);

    return StatsMap[id](value);
};

export const inValidKey = (e) => {
    const key = Number(e.key);
    return isNaN(key);
};
