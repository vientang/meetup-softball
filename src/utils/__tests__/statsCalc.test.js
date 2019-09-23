/* eslint-disable no-undef */
import {
    getAtBats,
    getAverage,
    getHits,
    getOnBasePercentage,
    getOPS,
    getOuts,
    getRunsCreated,
    getSlugging,
    getTeamRunsScored,
    getTeamTotalHits,
    getTotalBases,
    getWOBA,
    addDerivedStats,
    calculateTotals,
    mergeGameStats,
    mergePlayerStats,
} from '../statsCalc';

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

describe('Stats calculations', () => {
    it('hits', () => {
        expect(getHits(1, 2, 3, 4)).toBe(10);
        expect(getHits(0, 0, 0, 0)).toBe(0);
        expect(getHits(1, 1, 0, 1)).toBe(3);
    });

    it('at bats', () => {
        expect(getAtBats(1, 0)).toBe(1);
        expect(getAtBats(90, 45)).toBe(135);
        expect(getAtBats(0, 0)).toBe(0);
    });

    it('total bases', () => {
        expect(getTotalBases(1, 2, 3, 4)).toBe(30);
        expect(getTotalBases(0, 0, 0, 0)).toBe(0);
        expect(getTotalBases(10, 10, 10, 10)).toBe(100);
    });

    it('runs created', () => {
        expect(getRunsCreated(5, 1, 0, 6, 1, 5)).toBe(6.55);
        expect(getRunsCreated(5, 0, 0, 6, 1, 0)).toBe(0);
    });

    it('calculate average', () => {
        expect(getAverage(1, 5)).toBe(0.2);
        expect(getAverage(1, 0)).toBe(0.0);
        expect(getAverage(0, 8)).toBe(0.0);
    });

    it('calculate on base percentage', () => {
        expect(getOnBasePercentage(2, 1, 2, 0)).toBe(1.0);
        expect(getOnBasePercentage(0, 0, 0, 0)).toBe(0.0);
        expect(getOnBasePercentage(1, 1, 1, 1)).toBe(0.667);
    });

    it('calculate slugging percentage', () => {
        expect(getSlugging(2, 1)).toBe(2.0);
        expect(getSlugging(0, 0)).toBe(0.0);
        expect(getSlugging(10, 10)).toBe(1.0);
    });

    it('calculate OPS', () => {
        expect(getOPS(0.25, 0.5)).toBe(0.75);
        expect(getOPS(0.0, 0.0)).toBe(0.0);
        expect(getOPS(0.45, 0.725)).toBe(1.175);
    });

    it('calculate wOBA', () => {
        expect(getWOBA(1, 1, 1, 1, 1, 4, 1)).toBe(1.094);
        expect(getWOBA(0, 0, 0, 0, 0, 0, 0)).toBe(0.0);
    });

    it('calculate total team runs scored', () => {
        const players = [{ r: '1' }, { r: '1' }, { r: '1' }];
        expect(getTeamRunsScored(players)).toBe(3);
        expect(getTeamRunsScored([...players, { r: null }])).toBe(3);
    });

    it('calculate total team hits', () => {
        const players = [
            { singles: '1', doubles: '1', triples: '1', hr: '1' },
            { singles: '1', doubles: '1', triples: '1', hr: '1' },
        ];
        expect(getTeamTotalHits(players)).toBe(8);

        players.push({ singles: null, doubles: 0, triples: undefined, hr: '' });
        expect(getTeamTotalHits(players)).toBe(8);
    });

    it('calculate outs', () => {
        expect(getOuts(5, 1, 0)).toBe(4);
    });
});
