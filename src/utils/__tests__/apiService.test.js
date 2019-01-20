import apiService from '../apiService';
const { 
    mergeGameStats, 
    mergeAndSavePlayerStats, 
} = apiService;

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

    it('merges existing player stats with stats from current game', () => {
        const playerStatsResult = [
            {
                "1b": "2",
                "2b": "2",
                "3b": "2",
                "ab": "7",
                "avg": ".714",
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
                "obp": "0.6666666666666666",
                "ops": "2.238095238095238",
                "r": "2",
                "rbi": "2",
                "rc": "8.066666666666666",
                "sac": "2",
                "sb": "2",
                "slg": "1.5714285714285714",
                "tb": "11",
                "w": "11",
                "woba": "0.730"
            },
            {
                "1b": "2",
                "2b": "2",
                "3b": "2",
                "ab": "7",
                "avg": ".714",
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
                "obp": "0.6666666666666666",
                "ops": "2.238095238095238",
                "r": "2",
                "rbi": "2",
                "rc": "8.066666666666666",
                "sac": "2",
                "sb": "2",
                "slg": "1.5714285714285714",
                "tb": "11",
                "w": "20",
                "woba": "0.730"
            },
        ];
        expect(mergeAndSavePlayerStats(existingPlayerStats, playerStats)).toEqual(playerStatsResult);
    });
});