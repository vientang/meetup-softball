import statsCalc from '../statsCalc';
const { 
    mergeGameStats, 
    mergePlayerStats, 
    getHits, 
    getAtBats, 
    getRunsCreated, 
    getTotalBases, 
    getAverage 
} = statsCalc;

const meetupData = {
    id: "brnhcqyxmbcb",
    name: "Game 235 @???? @ 1030am",
    local_date: "2018-09-01",
    venue: {
        name: "Westlake Park",
        address_1: "95 Lake Merced Blvd",
        city: "Daly City",
        country: "US"
    }
};

const currentGameStats = {
    tournamentName: null,
    winners: {
        name: 'Winners',
        runs: '10',
        homeField: true,
        players: [
            {
                id: '123',
                meetupId: '234078828',
                name: 'Fresh Basta',
                gamesPlayed: '1',
                o: '1',
                "1b": '1',
                "2b": '1',
                "3b": '1',
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
                wins: '1',
                losses: '0'
            }
        ]
    },
    losers: {
        name: 'Losers',
        runs: '9',
        homeField: false,
        players: [
            {
                id: '456',
                meetupId: '254078828',
                name: 'Steven',
                gamesPlayed: '1',
                o: '1',
                "1b": '1',
                "2b": '1',
                "3b": '1',
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
                wins: '0',
                losses: '1'
            }
        ]
    }
};

const existingPlayerStats = [
    {
        id: '123',
        meetupId: '234078828',
        name: 'Fresh Basta',
        gamesPlayed: '3',
        o: '1',
        "1b": '1',
        "2b": '1',
        "3b": '1',
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
        h: '1',
        sac: '1',
        wins: '10',
        losses: '7'
    },
    {
        id: '456',
        meetupId: '254078828',
        name: 'Steven',
        gamesPlayed: '5',
        o: '1',
        "1b": '1',
        "2b": '1',
        "3b": '1',
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
        h: '1',
        sac: '1',
        wins: '20',
        losses: '3'
    }
];

describe('Update game stats', () => {
    it ('appends current game stats to existing game stats', () => {
        const gameStats = {
            gameId: '235',
            date: meetupData.local_date,
            year: '2018',
            month: '09',
            fieldName: meetupData.venue.name,
            tournamentName: null,
            winners: currentGameStats.winners,
            losers: currentGameStats.losers,
        };
        
        expect(mergeGameStats(meetupData, currentGameStats)).toEqual(gameStats);
    });
});

describe('Update player stats', () => {
    it ('calculate hits', () => {
        expect(getHits(1, 2, 3, 4)).toBe(10);
        expect(getHits(0, 0, 0, 0)).toBe(0);
    });

    it ('calculate at bats', () => {
        expect(getAtBats(1, 0)).toBe(1);
    });

    it ('calculate total bases', () => {
        expect(getTotalBases(1, 2, 3, 4)).toBe(30);
    });

    it ('calculate runs created', () => {
        expect(getRunsCreated(5, 1, 0, 6, 1, 5)).toBe(6.55);
    });

    it ('calculate average', () => {
        expect(getAverage(1, 5)).toBe(0.2);
    });

    it ('merges existing player stats with stats from current game', () => {
        const playerStatsResult = [
            {
                "1b": "2",
                "2b": "2",
                "3b": "2",
                "ab": "7",
                "avg": "0.7142857142857143",
                "bb": "2",
                "cs": "1",
                "gamesPlayed": '4',
                "h": "5",
                "hr": "2",
                "id": "123",
                "k": "2",
                "losses": "7",
                "meetupId": "234078828",
                "name": "Fresh Basta",
                "o": "2",
                "obp": "0.6666666666666666",
                "ops": "2.238095238095238",
                "r": "2",
                "rbi": "2",
                "rc": "8.066666666666666",
                "sac": "2",
                "sb": "2",
                "slg": "1.5714285714285714",
                "tb": "11",
                "wins": "11",
                "woba": "0.7295555555555555"
              },
              {
                "1b": "2",
                "2b": "2",
                "3b": "2",
                "ab": "7",
                "avg": "0.7142857142857143",
                "bb": "2",
                "cs": "1",
                "gamesPlayed": '6',
                "h": "5",
                "hr": "2",
                "id": "456",
                "k": "2",
                "losses": "4",
                "meetupId": "254078828",
                "name": "Steven",
                "o": "2",
                "obp": "0.6666666666666666",
                "ops": "2.238095238095238",
                "r": "2",
                "rbi": "2",
                "rc": "8.066666666666666",
                "sac": "2",
                "sb": "2",
                "slg": "1.5714285714285714",
                "tb": "11",
                "wins": "20",
                "woba": "0.7295555555555555"
              },
        ];
        expect(mergePlayerStats(existingPlayerStats, currentGameStats)).toEqual(playerStatsResult);
    });
});