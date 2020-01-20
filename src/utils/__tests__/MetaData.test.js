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
        const metadata = { perYear: JSON.stringify(perYear) };

        const currentGame = {
            year: '2020',
            month: 'Jan',
            field: 'Jackson',
        };
        expect(updateFieldsMonthsPerYear(metadata, currentGame)).toEqual({
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

    test('updateRecentGames', () => {});

    test('updateInactivePlayers', () => {});

    test('updateAllYears', () => {});

    test('updateAllFields', () => {});

    test('updateActivePlayers', () => {
        const activePlayers = [
            { id: '123', name: 'Fresh Basta', gp: 10, photos: {} },
            { id: '123', name: 'Fresh Basta', gp: 10, photos: {} },
            { id: '123', name: 'Fresh Basta', gp: 10, photos: {} },
            { id: '123', name: 'Fresh Basta', gp: 10, photos: {} },
            { id: '123', name: 'Fresh Basta', gp: 10, photos: {} },
        ];

        metadata.activePlayers = JSON.stringify([{}]);
    });
});
