import Utils from '../Utils';

const { setTopLeaders } = Utils;
const player1 = {
    name: 'vien',
    games: [{ hr: 5, rbi: 7 }, { hr: 10, rbi: 20 }, { hr: 15, rbi: 30 }],
};

const player2 = {
    name: 'mike',
    games: [{ hr: 5, rbi: 5 }, { hr: 10, rbi: 17 }, { hr: 15, rbi: 40 }],
};

const player3 = {
    name: 'carlos',
    games: [{ hr: 6, rbi: 8 }, { hr: '', rbi: '' }, { hr: null, rbi: null }],
};

const player4 = {
    name: 'john',
    games: [{ hr: 1, rbi: 4 }, { hr: 3, rbi: 10 }, { hr: 2, rbi: 4 }],
};

const player5 = {
    name: 'steven',
    games: [{ hr: 5, rbi: 5 }, { hr: 1, rbi: 3 }, { hr: 1, rbi: 2 }],
};

const player6 = {
    name: 'earl',
    games: [{ hr: 2, rbi: 2 }, { hr: 3, rbi: 7 }, { hr: 1, rbi: 3 }],
};

const player7 = {
    name: 'hector',
    games: [{ hr: null, rbi: 1 }, { hr: null, rbi: null }, { hr: null, rbi: '' }],
};

const player8 = {
    name: 'santiago',
    games: [{ hr: 6, rbi: 10 }, { hr: 9, rbi: 30 }, { hr: 23, rbi: 70 }],
};

const players = [player1, player2, player3, player4, player5, player6, player7, player8];

describe('Leaderboard Stats', () => {
    it('Get top 5 of home runs', () => {
        expect(setTopLeaders(players, 'hr')).toEqual([
            { playerName: 'santiago', total: 38 },
            { playerName: 'mike', total: 30 },
            { playerName: 'vien', total: 30 },
            { playerName: 'steven', total: 7 },
            { playerName: 'earl', total: 6 },
            { playerName: 'john', total: 6 },
            { playerName: 'carlos', total: 6 },
        ]);
    });

    it('Get top 5 of rbi', () => {
        expect(setTopLeaders(players, 'rbi')).toEqual([
            { playerName: 'santiago', total: 110 },
            { playerName: 'mike', total: 62 },
            { playerName: 'vien', total: 57 },
            { playerName: 'john', total: 18 },
            { playerName: 'earl', total: 12 },
        ]);
    });
});
