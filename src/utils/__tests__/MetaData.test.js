import {
    updateActivePlayers,
    updateAllActivePlayers,
    updateAllFields,
    updateAllYears,
    updateFieldsMonthsPerYear,
    updateInactivePlayers,
    updatePlayersCount,
    updateRecentGames,
} from '../MetaData';

describe('MetaData', () => {
    let metadata;
    beforeEach(() => {
        metadata = {};
    });

    const currentGame = {
        id: 'xxx',
        name: 'Game xxx',
        date: 'today',
        time: 'now',
        timeStamp: '9877654323',
        year: '2020',
        month: 'Jan',
        field: 'Jackson',
    };

    test('updateFieldsMonthsPerYear', () => {
        const perYear = {
            '2020': {
                gp: 1,
                months: ['Jan', 'Feb', 'March'],
                fields: {
                    westlake: 1,
                    parkside: 1,
                },
            },
        };

        expect(updateFieldsMonthsPerYear(perYear, currentGame)).toEqual({
            '2020': {
                gp: 2,
                months: ['Jan', 'Feb', 'March'],
                fields: {
                    westlake: 1,
                    parkside: 1,
                    Jackson: 1,
                },
            },
        });
    });

    test('updateRecentGames', () => {
        const recentGames = [
            {
                id: 'zzz',
                name: 'Game zzz',
                date: 'last month',
                field: 'Jackson',
                month: 'Dec',
                time: 'sometime before',
                timeStamp: '1234456566',
                year: '2019',
            },
        ];
        expect(updateRecentGames(recentGames, currentGame)).toEqual([currentGame, recentGames[0]]);
        expect(updateRecentGames(recentGames, currentGame).length).toBe(2);
        expect(updateRecentGames(recentGames, currentGame)[0]).toEqual({
            id: 'xxx',
            name: 'Game xxx',
            date: 'today',
            time: 'now',
            timeStamp: '9877654323',
            year: '2020',
            month: 'Jan',
            field: 'Jackson',
        });
    });

    test('updateAllYears', () => {});

    test('updateAllFields', () => {});
});

describe('Active and Inactive players', () => {
    const activePlayers = [
        { id: '123', name: 'Fresh Basta', gp: 10, photos: {} },
        { id: '234', name: 'Steven', gp: 10, photos: {} },
        { id: '345', name: 'Cara', gp: 10, photos: {} },
        { id: '456', name: 'Nate', gp: 10, photos: {} },
        { id: '567', name: 'Carlos', gp: 10, photos: {} },
    ];
    const inactivePlayers = [{ id: '678', name: 'Vien', gp: 1, photos: {} }];
    const players = [...activePlayers];
    const playersWithInactive = [...players, inactivePlayers[0]];

    test('updateActivePlayers', () => {
        expect(updateActivePlayers(activePlayers, [], players)).toEqual([
            { id: '123', name: 'Fresh Basta', gp: 11, photos: {} },
            { id: '234', name: 'Steven', gp: 11, photos: {} },
            { id: '345', name: 'Cara', gp: 11, photos: {} },
            { id: '456', name: 'Nate', gp: 11, photos: {} },
            { id: '567', name: 'Carlos', gp: 11, photos: {} },
        ]);
    });

    test('updateActivePlayers - includes inactive player', () => {
        expect(updateActivePlayers(activePlayers, inactivePlayers, playersWithInactive)).toEqual([
            { id: '123', name: 'Fresh Basta', gp: 11, photos: {} },
            { id: '234', name: 'Steven', gp: 11, photos: {} },
            { id: '345', name: 'Cara', gp: 11, photos: {} },
            { id: '456', name: 'Nate', gp: 11, photos: {} },
            { id: '567', name: 'Carlos', gp: 11, photos: {} },
            { id: '678', name: 'Vien', gp: 2, photos: {} },
        ]);
    });

    test('updateInactivePlayers', () => {
        expect(updateInactivePlayers(inactivePlayers, players)).toEqual(inactivePlayers);
    });

    test('updateInactivePlayers - no longer inactive', () => {
        expect(updateInactivePlayers(inactivePlayers, playersWithInactive)).toEqual([]);
    });
});
