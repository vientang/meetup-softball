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

    test('updateFieldsMonthsPerYear', () => {});

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
