/* eslint-disable no-undef */
import { addDerivedStats, mergeGameStats, mergePlayerStats } from '../apiService';

const meetupData = {
    id: 'mu-123',
    date: '2019-01-01',
    gameId: '235',
    year: '2019',
    month: 'January',
    name: 'Game 235 @???? @ 1030am',
    field: 'Westlake Park',
    tournamentName: 'Halloween',
};

const currentGame = {
    date: 'today',
    field: 'Westlake',
    gameId: '300',
    lat: '111',
    lon: '111',
    id: 'zzz',
    month: 'Jan',
    name: 'MU',
    rsvps: '1',
    time: 'local time',
    timeStamp: 'time now',
    tournamentName: 'MU',
    waitListCount: '0',
    year: '2019',
};

const currentPlayerStats = [
    {
        id: '123',
        name: 'Fresh Basta',
        joined: 123,
        admin: false,
        status: 'active',
        gender: '',
        photos: 'http://photo',
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
        avg: '.600',
        ab: '1',
        tb: '1',
        rc: '.800',
        h: '1',
        sac: '1',
    },
    {
        id: '456',
        name: 'Steven',
        joined: 234,
        admin: true,
        status: 'active',
        gender: '',
        photos: 'http://photo',
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
        avg: '.200',
        ab: '1',
        tb: '1',
        rc: '.400',
        h: '1',
        sac: '1',
    },
];

const mergedPlayerStats = [
    {
        id: '123',
        name: 'Fresh Basta',
        joined: 123,
        admin: false,
        status: 'active',
        gender: 'n/a',
        photos: '{}',
        profile: '{}',
        games: [
            {
                ab: '1',
                battingOrder: '1',
                o: '1',
                singles: '1',
                doubles: '1',
                triples: '1',
                h: '1',
                hr: '1',
                rbi: '1',
                r: '2',
                sb: '1',
                cs: '0',
                k: '1',
                bb: '1',
                sac: '1',
                w: '1',
                l: '0',
                gp: '1',
                date: 'today',
                field: 'Westlake',
                lat: '111',
                lon: '111',
                month: 'Jan',
                name: 'MU',
                time: 'local time',
                timeStamp: 'time now',
                tournamentName: 'MU',
                year: '2019',
            },
        ],
    },
    {
        id: '456',
        name: 'Steven',
        joined: 234,
        admin: true,
        status: 'active',
        gender: 'n/a',
        photos: '{}',
        profile: '{}',
        games: [
            {
                ab: '1',
                battingOrder: '1',
                o: '1',
                singles: '1',
                doubles: '1',
                triples: '1',
                h: '1',
                hr: '1',
                rbi: '1',
                r: '1',
                sb: '1',
                cs: '0',
                k: '1',
                bb: '1',
                sac: '1',
                w: '0',
                l: '1',
                gp: '1',
                date: 'today',
                field: 'Westlake',
                lat: '111',
                lon: '111',
                month: 'Jan',
                name: 'MU',
                time: 'local time',
                timeStamp: 'time now',
                tournamentName: 'MU',
                year: '2019',
            },
        ],
    },
];
// convertStatsForTable
// calcPlayerStats
// updateSummarizedStats - mocks
// postSummarizedStats - mocks
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
