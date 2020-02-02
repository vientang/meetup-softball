import { prepareGameStats } from '../GameStats';
import { addDerivedStats } from '../statsCalc';
import mockAPIData from '../../../__mocks__/mockAPIData';

const { meetupData, currentPlayerStats } = mockAPIData;

describe('Game stats', () => {
    const isTie = false;
    let winningTeam;
    let losingTeam;
    let gameStats;

    beforeEach(() => {
        winningTeam = addDerivedStats([currentPlayerStats[0]], isTie, true);
        losingTeam = addDerivedStats([currentPlayerStats[1]], isTie, false);
        gameStats = {
            ...meetupData,
            winners: JSON.stringify({
                name: 'Winners',
                runsScored: 2,
                totalHits: 4,
                players: [winningTeam[0]],
            }),
            losers: JSON.stringify({
                name: 'Losers',
                runsScored: 1,
                totalHits: 4,
                players: [losingTeam[0]],
            }),
            playerOfTheGame: JSON.stringify({}),
        };
    });

    const mockPrepare = (potg = {}) => {
        return prepareGameStats(meetupData, [currentPlayerStats[0]], [currentPlayerStats[1]], potg);
    };

    it('prepare game stats for database', () => {
        expect(mockPrepare()).toEqual(gameStats);
    });

    it('adds player of the game', () => {
        const potg = { id: '123', name: 'Fresh Basta', winner: true };
        expect(mockPrepare(potg).playerOfTheGame).toBe(JSON.stringify(potg));
    });

    it('stringify winners', () => {
        expect(typeof mockPrepare().winners).toBe('string');
    });

    it('stringify losers', () => {
        expect(typeof mockPrepare().losers).toBe('string');
    });

    it('stringify playerOfTheGame', () => {
        expect(typeof mockPrepare().playerOfTheGame).toBe('string');
    });
});
