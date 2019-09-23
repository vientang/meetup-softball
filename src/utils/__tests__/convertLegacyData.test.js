/* eslint-disable no-undef */
import { getGameId } from '../convertLegacyData';

describe('Game Ids', () => {
    it('create first game id', async () => {
        expect(getGameId('7/20/2019', '11:00:00')).toBe(1);
    });

    it('create consecutive ids', async () => {
        const games = [
            {
                date: '7/20/2019',
                time: '11:00:00',
            },
            {
                date: '7/21/2019',
                time: '11:00:00',
            },
            {
                date: '7/22/2019',
                time: '11:00:00',
            },
            {
                date: '7/23/2019',
                time: '11:00:00',
            },
        ];
        let id = 0;
        games.forEach((gameData) => {
            id += 1;
            expect(getGameId(gameData.date, gameData.time)).toBe(id);
        });

        expect(getGameId(games[3].date, games[3].time)).toBe(id);
    });
});
