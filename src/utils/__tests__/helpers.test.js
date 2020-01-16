import {
    buildFilterMenu,
    convertStatsForTable,
    convertStringStatsToNumbers,
    createGame,
    createPlayer,
    createSlug,
    findPlayerById,
    formatCellValue,
    getDefaultSortedColumn,
    getFieldName,
    getIdFromFilterParams,
    getMeridiem,
    isPlayerOfTheGame,
    parsePhotosAndProfile,
    parseStats,
    serializeStats,
} from '../helpers';

describe('convertStatsForTable', () => {
    it('convert object values to array', () => {
        const stats = {
            '111': {
                name: 'playerA',
                hr: 1,
            },
        };
        expect(convertStatsForTable(stats)).toEqual([
            {
                name: 'playerA',
                hr: 1,
            },
        ]);
    });

    it('no conversion needed', () => {
        const stats = [
            {
                name: 'playerA',
                hr: 1,
            },
        ];
        expect(convertStatsForTable(stats)).toEqual(stats);
    });

    it('should not convert', () => {
        expect(convertStatsForTable()).toEqual(null);
        expect(convertStatsForTable(null)).toEqual(null);
    });
});

describe('findPlayerById', () => {
    it('find player by id', () => {
        expect(findPlayerById('111', { 111: { name: 'playerA' } })).toEqual({ name: 'playerA' });
        expect(findPlayerById('111', [{ id: '111', name: 'playerA' }])).toEqual({
            id: '111',
            name: 'playerA',
        });
    });

    it('cannot find player', () => {
        expect(findPlayerById(null, { 111: { name: 'playerA' } })).toBe(null);
        expect(findPlayerById('111', { 110: { name: 'playerA' } })).toBe(undefined);
        expect(findPlayerById('111', [{ 110: { name: 'playerA' } }])).toBe(undefined);
    });
});

describe('serializeStats', () => {
    it('serialize object', () => {
        expect(serializeStats({ name: 'playerA' })).toEqual(JSON.stringify({ name: 'playerA' }));
    });

    it('serialize array', () => {
        expect(serializeStats([{ name: 'playerA' }])).toEqual(
            JSON.stringify([{ name: 'playerA' }]),
        );
    });

    it('should not serialize', () => {
        expect(serializeStats()).toBe(null);
        expect(serializeStats(1)).toBe(null);
        expect(serializeStats('1')).toBe(null);
    });
});

describe('parseStats', () => {
    it('parse JSON string', () => {
        expect(parseStats(JSON.stringify([{ name: 'playerA' }]))).toEqual([{ name: 'playerA' }]);
        expect(parseStats(JSON.stringify({ name: 'playerA' }))).toEqual({ name: 'playerA' });
    });

    it('should not need to parse', () => {
        const stats = [{ name: 'playerA' }];
        expect(parseStats(stats)).toEqual([{ name: 'playerA' }]);
    });

    it('nothing to parse', () => {
        expect(parseStats()).toEqual(null);
        expect(parseStats(undefined)).toEqual(null);
        expect(parseStats('')).toEqual(null);
        expect(parseStats('undefined')).toEqual(null);
    });
});

describe('getIdFromFilterParams', () => {
    it('year as id', () => {
        const params = {
            year: '2019',
        };
        expect(getIdFromFilterParams(params)).toBe('_2019');
    });

    it('year and field as id', () => {
        const params = {
            year: '2019',
            field: 'westlake',
        };
        expect(getIdFromFilterParams(params)).toBe('_2019_westlake');
    });

    it('year, month and field as id', () => {
        const params = {
            year: '2019',
            field: 'westlake',
            month: '09',
        };
        expect(getIdFromFilterParams(params)).toBe('_2019_09_westlake');
    });

    it('field as id', () => {
        const params = {
            field: 'westlake',
        };
        expect(getIdFromFilterParams(params)).toBe('_westlake');
    });

    it('month as id', () => {
        const params = {
            month: '09',
        };
        expect(getIdFromFilterParams(params)).toBe('_09');
    });

    it('field and month as id', () => {
        const params = {
            month: '09',
            field: 'westlake',
        };
        expect(getIdFromFilterParams(params)).toBe('_09_westlake');
    });

    it('null as id', () => {
        expect(getIdFromFilterParams()).toBe(null);
        expect(getIdFromFilterParams(undefined)).toBe(null);
        expect(getIdFromFilterParams({})).toBe(null);
    });
});

describe('getDefaultSortedColumn', () => {
    const id = '111';
    const desc = 'desc';
    expect(getDefaultSortedColumn(id, desc)).toEqual([{ id, desc }]);
});

describe('isPlayerOfTheGame', () => {
    let player;
    let playerOfTheGame;
    beforeEach(() => {
        playerOfTheGame = {};
        player = {};
    });
    test('player of the game selected', () => {
        playerOfTheGame.id = '123';
        player.id = '123';
        expect(isPlayerOfTheGame(player, playerOfTheGame)).toBe(true);
    });

    test('player of the game not selected', () => {
        expect(isPlayerOfTheGame(player, playerOfTheGame)).toBe(false);
    });
});

describe('convertStringStatsToNumbers', () => {
    let stats;
    beforeEach(() => {
        stats = {
            bb: '1',
            cs: '0',
            doubles: '1',
            gp: '1',
            hr: '1',
            k: '1',
            l: '0',
            o: '3',
            r: '1',
            rbi: '1',
            sac: '1',
            sb: '0',
            singles: '1',
            triples: '1',
            w: '1',
        };
    });

    it('return numbers', () => {
        expect(convertStringStatsToNumbers(stats)).toEqual({
            bb: 1,
            cs: 0,
            doubles: 1,
            gp: 1,
            hr: 1,
            k: 1,
            l: 0,
            o: 3,
            r: 1,
            rbi: 1,
            sac: 1,
            sb: 0,
            singles: 1,
            triples: 1,
            w: 1,
        });
    });

    it('normalize null and undefined to zero', () => {
        stats.r = null;
        stats.rbi = undefined;
        expect(convertStringStatsToNumbers(stats).r).toBe(0);
        expect(convertStringStatsToNumbers(stats).rbi).toBe(0);
    });
});

describe('formatCellValue', () => {
    it('remove leading zero', () => {
        expect(formatCellValue('0.123')).toEqual('.123');
    });

    it('add trailing zero', () => {
        expect(formatCellValue('1.1')).toEqual('1.10');
    });

    it('remove extra trailing digits', () => {
        expect(formatCellValue('1.123123')).toEqual('1.12');
    });

    it('add zeroes', () => {
        expect(formatCellValue('11.1')).toEqual('11.10');
    });

    it('convert null value to 0', () => {
        expect(formatCellValue(null)).toEqual('0');
    });

    it('create a slug for url', () => {
        expect(createSlug('basta Fresh')).toEqual('basta_fresh');
    });
});

describe('createSlug', () => {
    it('joins name with space', () => {
        const name = 'fresh basta';
        expect(createSlug(name)).toBe('fresh_basta');
    });

    it('formats to lowercase', () => {
        const name = 'a HeRTz';
        expect(createSlug(name)).toBe('a_hertz');
    });

    it('remove dot', () => {
        const name = 'Steven C.';
        expect(createSlug(name)).toBe('steven_c');
    });
});

describe('getMeridiem', () => {
    it('am', () => {
        const time = '10:30';
        expect(getMeridiem(time)).toBe('am');
    });

    it('pm', () => {
        const time = '1:30';
        expect(getMeridiem(time)).toBe('pm');
    });

    it('empty string', () => {
        const time = undefined;
        expect(getMeridiem(time)).toBe('');
    });
});

describe('parsePhotosAndProfile', () => {
    expect(
        parsePhotosAndProfile({
            photos: JSON.stringify({ highRes: 'https://' }),
            profile: JSON.stringify({ name: 'Scoops' }),
        }),
    ).toEqual({
        photos: { highRes: 'https://' },
        profile: { name: 'Scoops' },
    });
});

describe('getFieldName', () => {
    it('find exact match', () => {
        expect(getFieldName('Jackson', { Jackson: 'Jackson' })).toBe('Jackson');
    });

    it('find partial match', () => {
        expect(getFieldName('Jackson #2', { Jackson: 'Jackson' })).toBe('Jackson');
    });

    it('find match with different casing', () => {
        expect(getFieldName('jackson', { Jackson: 'Jackson' })).toBe('Jackson');
    });
});

describe('buildFilterMenu', () => {
    const metadata = {
        perYear: JSON.stringify({
            2019: { fields: { Jackson: 1, Rolph: 2 }, months: ['11', '12'] },
        }),
    };
    expect(buildFilterMenu({ year: '2019' }, metadata)).toEqual({
        fields: ['Jackson', 'Rolph'],
        years: ['2019'],
        months: ['11', '12'],
    });
});

describe('createGame', () => {
    const game = {
        id: '123',
        local_date: '19-12',
        local_time: '09383828',
        name: 'Game 456',
        rsvp_limit: 22,
        venue: { name: 'Jackson' },
        waitlist_count: 5,
    };
    expect(createGame(game).id).toBe('123');
    expect(createGame(game).field).toBe('Jackson');
    expect(createGame(game).gameId).toBe('456');
    expect(createGame(game).month).toBe('12');
    expect(createGame(game).rsvps).toBe(22);
    expect(createGame(game).time).toBe('09383828');
    expect(createGame(game).waitListCount).toBe(5);
    expect(createGame(game).year).toBe('19');
});

describe('createPlayer', () => {
    let player;
    beforeEach(() => {
        player = {
            data: {
                name: 'Juice',
                id: 456,
                joined: 99,
                status: 'active',
            },
        };
    });

    it('player data', () => {
        expect(createPlayer(player).name).toBe('Juice');
        expect(createPlayer(player).id).toBe('456');
        expect(createPlayer(player).joined).toBe('99');
        expect(createPlayer(player).status).toBe('active');
    });

    it('null stats', () => {
        expect(createPlayer(player).singles).toBe(null);
        expect(createPlayer(player).doubles).toBe(null);
        expect(createPlayer(player).triples).toBe(null);
        expect(createPlayer(player).singles).toBe(null);
        expect(createPlayer(player).bb).toBe(null);
        expect(createPlayer(player).cs).toBe(null);
        expect(createPlayer(player).hr).toBe(null);
        expect(createPlayer(player).k).toBe(null);
        expect(createPlayer(player).o).toBe(null);
        expect(createPlayer(player).r).toBe(null);
        expect(createPlayer(player).rbi).toBe(null);
        expect(createPlayer(player).sac).toBe(null);
        expect(createPlayer(player).sb).toBe(null);
    });
});
