import { mergePlayerStats, isPlayerOfTheGame } from '../PlayerStats';
import mockAPIData from '../../../__mocks__/mockAPIData';

const { mergedPlayerStats, currentGame } = mockAPIData;

describe('PlayerStats', () => {
    const winners = [
        {
            name: 'Fresh Basta',
            id: '123',
            admin: false,
            photos: {},
            profile: {},
            battingOrder: '1',
            o: '1',
            singles: '1',
            doubles: '1',
            triples: '1',
            hr: '1',
            rbi: '1',
            r: '2',
            sb: '1',
            cs: '0',
            k: '1',
            bb: '1',
            ab: '1',
            h: '1',
            sac: '1',
        },
    ];

    const losers = [
        {
            name: 'Steven',
            id: '234',
            admin: true,
            photos: {},
            profile: {},
            battingOrder: '1',
            o: '1',
            singles: '1',
            doubles: '1',
            triples: '1',
            hr: '1',
            rbi: '1',
            r: '1',
            sb: '1',
            cs: '0',
            k: '1',
            bb: '1',
            ab: '1',
            h: '1',
            sac: '1',
        },
    ];

    const playerOfTheGame = winners[0];

    test('merge player stats', () => {
        expect(mergePlayerStats(currentGame, winners, losers, playerOfTheGame)).toEqual(
            mergedPlayerStats,
        );
    });

    test('isPlayerOfTheGame', () => {
        expect(isPlayerOfTheGame(losers[0], playerOfTheGame)).toBe(false);
    });
});
