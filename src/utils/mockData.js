const player1 = {
    name: 'vien',
    games: [
        { singles: 2, doubles: 1, triples: 1, hr: 1, rbi: 4, o: 1, sac: 2, bb: 1, sb: 1, cs: 0 },
        { singles: 1, doubles: 3, triples: 0, hr: 1, rbi: 2, o: 1, sac: 0, bb: 0, sb: 0, cs: 1 },
        { singles: null, doubles: 0, triples: 0, hr: 0, rbi: 1, o: 1, sac: 1, bb: 0, sb: 0, cs: 0 },
    ],
};

const player2 = {
    name: 'steven',
    games: [
        { singles: 1, doubles: 1, triples: 1, hr: 0, rbi: 2, o: 2, sac: 3, bb: 1, sb: 1, cs: 2 },
        { singles: 1, doubles: 0, triples: 1, hr: 0, rbi: 0, o: 3, sac: 0, bb: 0, sb: 0, cs: 1 },
        { singles: 1, doubles: 1, triples: 0, hr: 1, rbi: 3, o: 1, sac: 0, bb: 0, sb: 0, cs: 0 },
    ],
};

const player3 = {
    name: 'laura',
    games: [
        { singles: 1, doubles: 1, triples: 1, hr: 1, rbi: 3, o: 2, sac: 0, bb: 0, sb: 1, cs: 0 },
        { singles: 2, doubles: 3, triples: 0, hr: 0, rbi: 2, o: 2, sac: 0, bb: 0, sb: 0, cs: 1 },
        { singles: 1, doubles: 1, triples: 0, hr: 0, rbi: 0, o: 3, sac: 0, bb: 0, sb: 0, cs: 0 },
    ],
};

const player4 = {
    name: 'santiago',
    games: [
        { singles: 2, doubles: 1, triples: 1, hr: 0, rbi: 1, o: 1, sac: 0, bb: 1, sb: 2, cs: 0 },
        { singles: 1, doubles: 1, triples: 1, hr: 0, rbi: 2, o: 2, sac: 1, bb: 0, sb: 1, cs: 1 },
        { singles: 2, doubles: 0, triples: 1, hr: 0, rbi: 0, o: 2, sac: 0, bb: 0, sb: 2, cs: 0 },
    ],
};

const player5 = {
    name: 'kevin',
    games: [
        { singles: 2, doubles: 1, triples: 0, hr: 0, rbi: 1, o: 1, sac: 0, bb: 1, sb: 0, cs: 0 },
        { singles: 1, doubles: 0, triples: 0, hr: 0, rbi: 0, o: 4, sac: 0, bb: 0, sb: 0, cs: 1 },
        { singles: 2, doubles: 0, triples: 0, hr: 0, rbi: 0, o: 0, sac: 0, bb: 0, sb: 0, cs: 0 },
    ],
};

const player6 = {
    name: 'mike',
    games: [
        { singles: 2, doubles: 1, triples: 1, hr: 1, rbi: 4, o: 1, sac: 2, bb: 1, sb: 1, cs: 0 },
        { singles: 1, doubles: 3, triples: 0, hr: 0, rbi: 2, o: 2, sac: 0, bb: 0, sb: 0, cs: 1 },
        { singles: 2, doubles: 0, triples: 1, hr: 0, rbi: 2, o: 0, sac: 1, bb: 0, sb: 2, cs: 0 },
    ],
};

const player7 = {
    name: 'carlos',
    games: [
        { singles: 2, doubles: 1, triples: 1, hr: 1, rbi: 6, o: 1, sac: 0, bb: 1, sb: 1, cs: 0 },
        { singles: 1, doubles: 3, triples: 0, hr: 1, rbi: 5, o: 2, sac: 0, bb: 0, sb: 0, cs: 1 },
        { singles: 1, doubles: 1, triples: 1, hr: 1, rbi: 3, o: 0, sac: 0, bb: 0, sb: 0, cs: 0 },
    ],
};

const player8 = {
    name: 'natcha',
    games: [
        { singles: 2, doubles: 1, triples: 1, hr: 0, rbi: 2, o: 2, sac: 0, bb: 1, sb: 1, cs: 0 },
        { singles: 1, doubles: 3, triples: 0, hr: 0, rbi: 2, o: 2, sac: 0, bb: 0, sb: 0, cs: 0 },
        { singles: 1, doubles: 1, triples: 0, hr: 0, rbi: 0, o: 2, sac: 0, bb: 1, sb: 0, cs: 0 },
    ],
};

const mockLeaderBoard = [player1, player2, player3, player4, player5, player6, player7, player8];

export default {
    mockLeaderBoard,
};
