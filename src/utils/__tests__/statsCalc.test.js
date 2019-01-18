import statsCalc from '../statsCalc';
const { 
    mergeGameStats, 
    mergeAndSavePlayerStats, 
    getHits, 
    getAtBats, 
    getRunsCreated, 
    getTotalBases, 
    getAverage,
    getOnBasePercentage,
    getSlugging,
    getOPS,
    getWOBA
} = statsCalc;

const meetupData = {
    id: "brnhcqyxmbcb",
    meetupId: 'mu-123',
    name: "Game 235 @???? @ 1030am",
    local_date: "2018-09-01",
    tournamentName: "Halloween",
    venue: {
        name: "Westlake Park",
        address_1: "95 Lake Merced Blvd",
        city: "Daly City",
        country: "US"
    }
};

const playerStats = [
    {
        id: '123',
        meetupId: '234078828',
        name: 'Fresh Basta',
        gp: '1',
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
        w: '1',
        l: '0'
    },
    {
        id: '456',
        meetupId: '254078828',
        name: 'Steven',
        gp: '1',
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
        w: '0',
        l: '1'
    }
];

const currentGameStats = {
    tournamentName: null,
    winners: JSON.stringify({
        name: 'Winners',
        homeField: true,
        players: [playerStats[0]],
    }),
    losers: JSON.stringify({
        name: 'Losers',
        homeField: false,
        players: [playerStats[1]],
    }),
};

const existingPlayerStats = [
    {
        id: '123',
        meetupId: '234078828',
        name: 'Fresh Basta',
        gp: '3',
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
        w: '10',
        l: '7'
    },
    {
        id: '456',
        meetupId: '254078828',
        name: 'Steven',
        gp: '5',
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
        w: '20',
        l: '3'
    }
];

describe('Update game stats', () => {
    it ('appends current game stats to existing game stats', () => {
        const gameStats = {
            meetupId: meetupData.meetupId,
            gameId: '235',
            name: meetupData.venue.name,
            date: meetupData.local_date,
            year: '2018',
            month: '09',
            fieldName: meetupData.venue.name,
            tournamentName: meetupData.tournamentName,
            winners: currentGameStats.winners,
            losers: currentGameStats.losers,
        };
        
        expect(mergeGameStats(meetupData, [playerStats[0]], [playerStats[1]])).toEqual(gameStats);
    });
});

describe('Update player stats', () => {
    it ('calculate hits', () => {
        expect(getHits(1, 2, 3, 4)).toBe(10);
        expect(getHits(0, 0, 0, 0)).toBe(0);
        expect(getHits(1, 1, 0, 1)).toBe(3);
    });

    it ('calculate at bats', () => {
        expect(getAtBats(1, 0)).toBe(1);
        expect(getAtBats(90, 45)).toBe(135);
        expect(getAtBats(0, 0)).toBe(0);
    });

    it ('calculate total bases', () => {
        expect(getTotalBases(1, 2, 3, 4)).toBe(30);
        expect(getTotalBases(0, 0, 0, 0)).toBe(0);
        expect(getTotalBases(10, 10, 10, 10)).toBe(100);
    });

    it ('calculate runs created', () => {
        expect(getRunsCreated(5, 1, 0, 6, 1, 5)).toBe(6.55);
        expect(getRunsCreated(5, 0, 0, 6, 1, 0)).toBe(0);
    });

    it ('calculate average', () => {
        expect(getAverage(1, 5)).toBe(0.200);
        expect(getAverage(1, 0)).toBe(0.000);
        expect(getAverage(0, 8)).toBe(0.000);

    });

    it ('calculate on base percentage', () => {
        expect(getOnBasePercentage(2, 1, 2, 0)).toBe(1.000);
        expect(getOnBasePercentage(0, 0, 0, 0)).toBe(.000);
        expect(getOnBasePercentage(1, 1, 1, 1)).toBe(.667);
    });
    it ('calculate slugging percentage', () => {
        expect(getSlugging(2, 1)).toBe(2.000);
        expect(getSlugging(0, 0)).toBe(.000);
        expect(getSlugging(10, 10)).toBe(1.000);
    });
    it ('calculate OPS', () => {
        expect(getOPS(.250, .500)).toBe(.750);
        expect(getOPS(.000, .000)).toBe(.000);
        expect(getOPS(.450, .725)).toBe(1.175);
    });

    it ('calculate wOBA', () => {
        expect(getWOBA(1, 1, 1, 1, 1, 4, 1)).toBe(1.094);
        expect(getWOBA(0, 0, 0, 0, 0, 0, 0)).toBe(.000);
    });


    it ('merges existing player stats with stats from current game', () => {
        const playerStatsResult = [
            {
                "1b": "2",
                "2b": "2",
                "3b": "2",
                "ab": "7",
                "avg": "0.714",
                "bb": "2",
                "cs": "1",
                "gp": '4',
                "h": "5",
                "hr": "2",
                "id": "123",
                "k": "2",
                "l": "7",
                "meetupId": "234078828",
                "name": "Fresh Basta",
                "o": "2",
                "obp": "0.667",
                "ops": "2.238",
                "r": "2",
                "rbi": "2",
                "rc": "8.067",
                "sac": "2",
                "sb": "2",
                "slg": "1.571",
                "tb": "11",
                "w": "11",
                "woba": "0.730"
              },
              {
                "1b": "2",
                "2b": "2",
                "3b": "2",
                "ab": "7",
                "avg": "0.714",
                "bb": "2",
                "cs": "1",
                "gp": '6',
                "h": "5",
                "hr": "2",
                "id": "456",
                "k": "2",
                "l": "4",
                "meetupId": "254078828",
                "name": "Steven",
                "o": "2",
                "obp": "0.667",
                "ops": "2.238",
                "r": "2",
                "rbi": "2",
                "rc": "8.067",
                "sac": "2",
                "sb": "2",
                "slg": "1.571",
                "tb": "11",
                "w": "20",
                "woba": "0.730"
              },
        ];
        expect(mergeAndSavePlayerStats(existingPlayerStats, currentGameStats)).toEqual(playerStatsResult);
    });
});