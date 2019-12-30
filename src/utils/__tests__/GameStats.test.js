import { mergeGameStats } from '../GameStats';
import { addDerivedStats } from '../statsCalc';
import mockAPIData from '../../../__mocks__/mockAPIData';

const { meetupData, currentPlayerStats } = mockAPIData;

describe('Game stats', () => {
    it('appends current game stats to existing game stats', () => {
        const isTie = false;
        const winningTeam = addDerivedStats([currentPlayerStats[0]], isTie, true);
        const losingTeam = addDerivedStats([currentPlayerStats[1]], isTie, false);

        const gameStats = {
            id: meetupData.id,
            gameId: meetupData.gameId,
            name: meetupData.name,
            date: meetupData.date,
            year: meetupData.year,
            month: meetupData.month,
            field: meetupData.field,
            tournamentName: meetupData.tournamentName,
            playerOfTheGame: JSON.stringify({}),
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
        };

        expect(
            mergeGameStats(meetupData, [currentPlayerStats[0]], [currentPlayerStats[1]]),
        ).toEqual(gameStats);
    });
});
