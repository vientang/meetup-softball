/* eslint-disable no-undef */
import { addDerivedStats, calculateTotals, mergeGameStats, mergePlayerStats } from '../apiService';
import mockAPIData from '../../../__mocks__/mockAPIData';

const { meetupData, mergedPlayerStats, currentGame, currentPlayerStats } = mockAPIData;

describe('Player stats', () => {
    const winners = [
        {
            name: 'Fresh Basta',
            joined: 123,
            meetupId: '123',
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
            joined: 234,
            meetupId: '456',
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

    it('merge player stats', () => {
        expect(mergePlayerStats(currentGame, winners, losers)).toEqual(mergedPlayerStats);
    });
});

describe('Game stats', () => {
    it('appends current game stats to existing game stats', () => {
        const isTie = false;
        const winningTeam = addDerivedStats([currentPlayerStats[0]], isTie, true);
        const losingTeam = addDerivedStats([currentPlayerStats[1]]);

        const gameStats = {
            id: meetupData.id,
            gameId: meetupData.gameId,
            name: meetupData.name,
            date: meetupData.date,
            year: meetupData.year,
            month: meetupData.month,
            field: meetupData.field,
            tournamentName: meetupData.tournamentName,
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

describe('Add derived stats', () => {
    let isTie = false;
    it('winners', () => {
        const winner = true;
        expect(addDerivedStats([currentPlayerStats[0]], isTie, winner)).toEqual([
            { ...currentPlayerStats[0], w: '1', l: '0', gp: '1' },
        ]);
    });

    it('losers', () => {
        const winner = false;
        expect(addDerivedStats([currentPlayerStats[1]], isTie, winner)).toEqual([
            { ...currentPlayerStats[1], w: '0', l: '1', gp: '1' },
        ]);
    });

    it('tie', () => {
        isTie = true;
        const winner = false;
        expect(addDerivedStats([currentPlayerStats[1]], isTie, winner)).toEqual([
            { ...currentPlayerStats[1], w: '0', l: '0', gp: '1' },
        ]);
    });
});

describe('Update individual player stats', () => {
    const currentStats = {
        bb: '0',
        cs: '0',
        doubles: '1',
        gp: 1,
        hr: '1',
        k: '0',
        l: '0',
        o: '0',
        r: '1',
        rbi: '2',
        sac: '0',
        sb: '0',
        singles: '1',
        triples: '0',
        w: '1',
    };
    const existingStats = {
        bb: '1',
        cs: '0',
        doubles: '10',
        gp: 5,
        hr: '1',
        k: '1',
        l: '1',
        o: '2',
        r: '1',
        rbi: '2',
        sac: '0',
        sb: '2',
        singles: '10',
        triples: '1',
        w: '1',
    };
    expect(calculateTotals(existingStats, currentStats)).toEqual({
        ab: 27,
        avg: 0.926,
        bb: 1,
        cs: 0,
        doubles: 11,
        gp: 6,
        h: 25,
        hr: 2,
        k: 1,
        l: 1,
        o: 2,
        obp: 0.929,
        ops: 2.559,
        r: 2,
        rbi: 4,
        rc: 41.879,
        sac: 0,
        sb: 2,
        singles: 11,
        slg: 1.63,
        tb: 44,
        triples: 1,
        w: 2,
        woba: 1.081,
    });
});
