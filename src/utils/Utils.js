/**
 * Make a player object with stat categories to show on AdminStatsTable
 * @param {Object} player data from meetup
 * @return {Object}
 */
const createPlayer = (player) => {
    const { name, id, joined, group_profile, is_pro_admin, photo, active } = player.data;
    return {
        name,
        joined,
        meetupId: id,
        profile: group_profile,
        admin: is_pro_admin,
        photos: photo,
        status: active,
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
};

const sortByNameLength = (a, b) => {
    if (a.length === b.length) {
        return a > b ? 1 : -1;
    }
    return a.length > b.length ? 1 : -1;
};

const sortHighToLow = (a, b) => {
    const aa = Number(a);
    const bb = Number(b);

    return aa < bb ? 1 : -1;
};

export default {
    createPlayer,
    sortByNameLength,
    sortHighToLow,
};
