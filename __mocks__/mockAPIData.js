const meetupData = {
    id: 'mu-123',
    gameId: '235',
    name: 'Game 235 @???? @ 1030am',
    date: '2019-01-01',
    year: '2019',
    month: 'January',
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

const players = [
    {
        id: '987',
        name: 'Vien',
        joined: 987,
        admin: true,
        status: 'active',
        gender: '',
        photos: 'http://photo',
        gp: '20',
        battingOrder: '1',
        o: '1',
        singles: '1',
        doubles: '1',
        triples: '1',
        hr: null,
        rbi: '1',
        r: '1',
        sb: null,
        cs: '0',
        k: '0',
        bb: '1',
        avg: undefined,
        ab: '1',
        tb: '1',
        rc: '.400',
        h: '1',
        sac: '1',
    },
    {
        id: '123',
        name: 'Fresh Basta',
        joined: 123,
        admin: false,
        status: 'active',
        gender: '',
        photos: 'http://photo',
        battingOrder: '1',
        gp: '20',
        o: '1',
        singles: '1',
        doubles: '1',
        triples: '1',
        hr: '50',
        rbi: '1',
        r: '2',
        sb: '10',
        cs: '0',
        k: '0',
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
        joined: 456,
        admin: true,
        status: 'active',
        gender: '',
        photos: 'http://photo',
        gp: '20',
        battingOrder: '1',
        o: '1',
        singles: '1',
        doubles: '1',
        triples: '1',
        hr: '3',
        rbi: '1',
        r: '1',
        sb: '8',
        cs: '0',
        k: '0',
        bb: '1',
        avg: '.200',
        ab: '1',
        tb: '1',
        rc: '.400',
        h: '1',
        sac: '1',
    },
    {
        id: '234',
        name: 'Dale',
        joined: 234,
        admin: true,
        status: 'active',
        gender: '',
        photos: 'http://photo',
        gp: '20',
        battingOrder: '1',
        o: '1',
        singles: '1',
        doubles: '1',
        triples: '1',
        hr: '4',
        rbi: '1',
        r: '1',
        sb: null,
        cs: '0',
        k: '0',
        bb: '1',
        avg: '.200',
        ab: '1',
        tb: '1',
        rc: '.400',
        h: '1',
        sac: '1',
    },
    {
        id: '567',
        name: 'Cara',
        joined: 567,
        admin: true,
        status: 'active',
        gender: '',
        photos: 'http://photo',
        gp: '20',
        battingOrder: '1',
        o: '1',
        singles: '1',
        doubles: '1',
        triples: '1',
        hr: '20',
        rbi: '1',
        r: '1',
        sb: '6',
        cs: '0',
        k: '0',
        bb: '1',
        avg: '.510',
        ab: '1',
        tb: '1',
        rc: '.400',
        h: '1',
        sac: '1',
    },
    {
        id: '789',
        name: 'John',
        joined: 789,
        admin: true,
        status: 'active',
        gender: '',
        photos: 'http://photo',
        gp: '20',
        battingOrder: '1',
        o: '1',
        singles: '1',
        doubles: '1',
        triples: '1',
        hr: '20',
        rbi: '1',
        r: '1',
        sb: null,
        cs: '0',
        k: '0',
        bb: '1',
        avg: '.550',
        ab: '1',
        tb: '1',
        rc: '.400',
        h: '1',
        sac: '1',
    },
    {
        id: '888',
        name: 'Carlos',
        joined: 888,
        admin: true,
        status: 'active',
        gender: '',
        photos: 'http://photo',
        gp: '20',
        battingOrder: '1',
        o: '1',
        singles: '1',
        doubles: '1',
        triples: '1',
        hr: '90',
        rbi: '1',
        r: '1',
        sb: null,
        cs: '0',
        k: '0',
        bb: '1',
        avg: '.700',
        ab: '1',
        tb: '1',
        rc: '.400',
        h: '1',
        sac: '1',
    },
    {
        id: '222',
        name: 'Santiago',
        joined: 222,
        admin: true,
        status: 'active',
        gender: '',
        photos: 'http://photo',
        gp: '20',
        battingOrder: '1',
        o: '1',
        singles: '1',
        doubles: '1',
        triples: '1',
        hr: '0',
        rbi: '1',
        r: '1',
        sb: null,
        cs: '0',
        k: '0',
        bb: '1',
        avg: '.200',
        ab: '1',
        tb: '1',
        rc: '.400',
        h: '1',
        sac: '1',
    },
    {
        id: '333',
        name: 'Natcha',
        joined: 333,
        admin: true,
        status: 'active',
        gender: '',
        photos: 'http://photo',
        gp: '20',
        battingOrder: '1',
        o: '1',
        singles: '1',
        doubles: '1',
        triples: '1',
        hr: '2',
        rbi: '1',
        r: '1',
        sb: null,
        cs: '0',
        k: '0',
        bb: '1',
        avg: '.200',
        ab: '1',
        tb: '1',
        rc: '.400',
        h: '1',
        sac: '1',
    },
    {
        id: '444',
        name: 'Peter',
        joined: 444,
        admin: true,
        status: 'active',
        gender: '',
        photos: 'http://photo',
        gp: '20',
        battingOrder: '1',
        o: '1',
        singles: '1',
        doubles: '1',
        triples: '1',
        hr: '40',
        rbi: '1',
        r: '1',
        sb: null,
        cs: '0',
        k: '0',
        bb: '1',
        avg: '.500',
        ab: '1',
        tb: '1',
        rc: '.400',
        h: '1',
        sac: '1',
    },
    {
        id: '555',
        name: 'Kevin A',
        joined: 555,
        admin: true,
        status: 'active',
        gender: '',
        photos: 'http://photo',
        gp: '2',
        battingOrder: '1',
        o: '1',
        singles: '1',
        doubles: '1',
        triples: '1',
        hr: '80',
        rbi: '1',
        r: '1',
        sb: null,
        cs: '0',
        k: '0',
        bb: '1',
        avg: '.800',
        ab: '1',
        tb: '1',
        rc: '.400',
        h: '1',
        sac: '1',
    },
];

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
        games: [
            {
                id: 'zzz',
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
                playerOfTheGame: true,
                time: 'local time',
                timeStamp: 'time now',
                tournamentName: 'MU',
                year: '2019',
            },
        ],
    },
    {
        id: '234',
        name: 'Steven',
        games: [
            {
                id: 'zzz',
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
                playerOfTheGame: false,
                time: 'local time',
                timeStamp: 'time now',
                tournamentName: 'MU',
                year: '2019',
            },
        ],
    },
];

export default {
    currentGame,
    currentPlayerStats,
    meetupData,
    mergedPlayerStats,
    players,
};
