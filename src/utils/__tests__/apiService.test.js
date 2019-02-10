import apiService from '../apiService';

const {
    addDerivedStats,
    mergeGameStats,
    mergeAndSavePlayerStats,
    updateMergedPlayerStats,
} = apiService;

const meetupData = {
    meetupId: 'mu-123',
    date: '2019-01-01',
    gameId: '235',
    year: '2019',
    month: 'January',
    name: 'Game 235 @???? @ 1030am',
    field: 'Westlake Park',
    tournamentName: 'Halloween',
};

const currentPlayerStats = [
    {
        id: '123',
        meetupId: '234078828',
        name: 'Fresh Basta',
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
        avg: '.600',
        ab: '1',
        tb: '1',
        rc: '.800',
        h: '1',
        sac: '1',
    },
    {
        id: '456',
        meetupId: '254078828',
        name: 'Steven',
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

const existingPlayerStats = [
    {
        id: '123',
        meetupId: '234078828',
        name: 'Fresh Basta',
        gp: '3',
        o: '1',
        singles: '1',
        doubles: '1',
        triples: '1',
        hr: '1',
        rbi: '1',
        r: '1',
        sb: '1',
        cs: '1',
        k: '1',
        bb: '1',
        avg: '.600',
        ab: '1',
        tb: '1',
        rc: '.800',
        h: '4',
        sac: '1',
        w: '10',
        l: '7',
    },
    {
        id: '456',
        meetupId: '254078828',
        name: 'Steven',
        gp: '5',
        o: '1',
        singles: '1',
        doubles: '1',
        triples: '1',
        hr: '1',
        rbi: '1',
        r: '1',
        sb: '1',
        cs: '1',
        k: '1',
        bb: '1',
        avg: '.600',
        ab: '1',
        tb: '1',
        rc: '.800',
        h: '4',
        sac: '1',
        w: '20',
        l: '3',
    },
];

const mergedResults = [
    {
        singles: '2',
        doubles: '2',
        triples: '2',
        ab: '10',
        avg: '0.8',
        bb: '2',
        cs: '1',
        gp: '4',
        h: '8',
        hr: '2',
        id: '123',
        k: '2',
        l: '7',
        meetupId: '234078828',
        name: 'Fresh Basta',
        o: '2',
        obp: '0.75',
        ops: '1.85',
        r: '2',
        rbi: '2',
        rc: '9.075',
        sac: '2',
        sb: '2',
        slg: '1.1',
        tb: '11',
        w: '11',
        woba: '0.547',
    },
    {
        singles: '2',
        doubles: '2',
        triples: '2',
        ab: '10',
        avg: '0.8',
        bb: '2',
        cs: '1',
        gp: '6',
        h: '8',
        hr: '2',
        id: '456',
        k: '2',
        l: '4',
        meetupId: '254078828',
        name: 'Steven',
        o: '2',
        obp: '0.75',
        ops: '1.85',
        r: '2',
        rbi: '2',
        rc: '9.075',
        sac: '2',
        sb: '2',
        slg: '1.1',
        tb: '11',
        w: '20',
        woba: '0.547',
    },
];

describe('Update player stats', () => {
    it('merge current player stats with career stats', () => {
        expect(
            updateMergedPlayerStats(
                existingPlayerStats,
                [currentPlayerStats[0]],
                [currentPlayerStats[1]],
            ),
        ).toEqual(mergedResults);
    });

    it('merges existing player stats with stats from current game', () => {
        const winners = [currentPlayerStats[0]];
        const losers = [currentPlayerStats[1]];
        const currentPlayers = winners.concat(losers);
        expect(mergeAndSavePlayerStats(existingPlayerStats, currentPlayers)).toEqual(mergedResults);
    });

    it('add derived stats', () => {
        expect(addDerivedStats([currentPlayerStats[0]], true)).toEqual([
            { ...currentPlayerStats[0], w: '1', l: '0', gp: '1' },
        ]);

        expect(addDerivedStats([currentPlayerStats[1]], false)).toEqual([
            { ...currentPlayerStats[1], w: '0', l: '1', gp: '1' },
        ]);
    });
});

describe('Update game stats', () => {
    it('appends current game stats to existing game stats', () => {
        const winningTeam = addDerivedStats([currentPlayerStats[0]], true);
        const losingTeam = addDerivedStats([currentPlayerStats[1]]);

        const gameStats = {
            meetupId: meetupData.meetupId,
            gameId: meetupData.gameId,
            name: meetupData.name,
            date: meetupData.date,
            year: meetupData.year,
            month: meetupData.month,
            field: meetupData.field,
            tournamentName: meetupData.tournamentName,
            winners: JSON.stringify({
                name: 'Winners',
                homeField: true,
                players: [winningTeam[0]],
            }),
            losers: JSON.stringify({
                name: 'Losers',
                homeField: false,
                players: [losingTeam[0]],
            }),
        };

        expect(
            mergeGameStats(meetupData, [currentPlayerStats[0]], [currentPlayerStats[1]]),
        ).toEqual(gameStats);
    });
});
