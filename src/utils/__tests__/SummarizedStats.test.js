import {
    createSummarizedStats,
    getSummarizedIds,
    findCurrentPlayers,
    findExistingPlayers,
    findNewPlayers,
    mergeSummarizedStats,
    updateCurrentPlayerStats,
    updateExistingStats,
} from '../SummarizeStats';

describe('SummarizedStats', () => {
    test('getSummarizedIds', () => {
        expect(
            getSummarizedIds({
                year: '2019',
                month: '12',
                field: 'West Sunset',
            }),
        ).toEqual([
            '_2019',
            '_2019_12',
            '_2019_12_west_sunset',
            '_2019_west_sunset',
            '_12',
            '_12_west_sunset',
            '_west_sunset',
            '_leaderboard_2019',
        ]);
    });

    describe('merge current stats with existing stats', () => {
        let summarized;
        let players;
        const cara = {
            id: '456',
            name: 'Cara',
            gp: '20',
            hr: '12',
        };
        const steven = {
            id: '234',
            name: 'Steven',
            gp: '1',
            hr: '11',
        };
        const dale = {
            id: '567',
            name: 'Dale',
            gp: '1',
            hr: '13',
        };
        beforeEach(() => {
            summarized = {
                _2019: [
                    {
                        id: '123',
                        name: 'Fresh Basta',
                        gp: '20',
                        hr: '10',
                    },
                ],
            };
            players = [
                {
                    id: '123',
                    name: 'Fresh Basta',
                    gp: '1',
                    hr: '10',
                },
            ];
        });

        test('findExistingPlayers', () => {
            summarized._2019.push(cara);
            expect(findExistingPlayers(summarized._2019, players)).toEqual([
                {
                    id: '456',
                    name: 'Cara',
                    gp: '20',
                    hr: '12',
                },
            ]);
        });

        test('findCurrentPlayers', () => {
            players.push(steven);
            expect(findCurrentPlayers(summarized._2019, players)).toEqual([
                {
                    id: '123',
                    name: 'Fresh Basta',
                    gp: '20',
                    hr: '10',
                },
            ]);
        });

        test('findNewPlayers', () => {
            players.push(steven);
            expect(findNewPlayers(summarized._2019, players)).toEqual([
                {
                    id: '234',
                    name: 'Steven',
                    hr: 11,
                    ab: 11,
                    avg: 1,
                    bb: 0,
                    cs: 0,
                    doubles: 0,
                    gp: 1,
                    h: 11,
                    k: 0,
                    l: 0,
                    o: 0,
                    obp: 1,
                    ops: 5,
                    r: 0,
                    rbi: 0,
                    rc: 44,
                    sac: 0,
                    sb: 0,
                    singles: 0,
                    slg: 4,
                    tb: 44,
                    triples: 0,
                    w: 0,
                    woba: 2.101,
                },
            ]);
        });

        test('updateCurrentPlayerStats', () => {
            expect(updateCurrentPlayerStats(summarized._2019, players)[0].hr).toBe(20);
        });

        test('updateExistingStats - entry count should equal original', () => {
            summarized._2019.push(cara, steven);
            expect(updateExistingStats(summarized._2019, players).length).toBe(3);
        });

        test('updateExistingStats - entry count should include new player', () => {
            summarized._2019.push(cara, steven);
            players.push(dale);
            expect(updateExistingStats(summarized._2019, players).length).toBe(4);
        });

        test('updateExistingStats - should calculate everything correctly', () => {
            summarized._2019.push(cara, steven);
            players.push(steven, dale);
            // cara
            expect(updateExistingStats(summarized._2019, players)[0].name).toBe('Cara');
            // string value is expected b/c it comes from the server as a string
            expect(updateExistingStats(summarized._2019, players)[0].hr).toBe('12');
            expect(updateExistingStats(summarized._2019, players)[0].gp).toBe('20');

            // mike
            expect(updateExistingStats(summarized._2019, players)[1].name).toBe('Fresh Basta');
            expect(updateExistingStats(summarized._2019, players)[1].hr).toBe(20);
            expect(updateExistingStats(summarized._2019, players)[1].gp).toBe(21);

            // steven
            expect(updateExistingStats(summarized._2019, players)[2].name).toBe('Steven');
            expect(updateExistingStats(summarized._2019, players)[2].hr).toBe(22);
            expect(updateExistingStats(summarized._2019, players)[2].gp).toBe(2);

            // dale
            expect(updateExistingStats(summarized._2019, players)[3].name).toBe('Dale');
            expect(updateExistingStats(summarized._2019, players)[3].hr).toBe(13);
            expect(updateExistingStats(summarized._2019, players)[3].gp).toBe(1);
        });

        test('createSummarizedStats', () => {
            players.push(steven);
            expect(createSummarizedStats(players).length).toBe(2);
        });

        test('createSummarizedStats', () => {
            expect(createSummarizedStats(players)[0]).toEqual({
                id: '123',
                name: 'Fresh Basta',
                ab: 10,
                avg: 1,
                bb: 0,
                cs: 0,
                doubles: 0,
                gp: 1,
                h: 10,
                hr: 10,
                k: 0,
                l: 0,
                o: 0,
                obp: 1,
                ops: 5,
                r: 0,
                rbi: 0,
                rc: 40,
                sac: 0,
                sb: 0,
                singles: 0,
                slg: 4,
                tb: 40,
                triples: 0,
                w: 0,
                woba: 2.101,
            });
        });

        test('mergeSummarizedStats for existing player', () => {
            expect(mergeSummarizedStats(summarized, players)._2019[0].hr).toBe(20);
            expect(mergeSummarizedStats(summarized, players)._2019[0].gp).toBe(21);
        });

        test('mergeSummarizedStats for new player', () => {
            players.push(steven);
            expect(mergeSummarizedStats(summarized, players)._2019.length).toBe(2);
            expect(mergeSummarizedStats(summarized, players)._2019[0].id).toBe('123');
            expect(mergeSummarizedStats(summarized, players)._2019[0].hr).toBe(20);
            expect(mergeSummarizedStats(summarized, players)._2019[1].id).toBe('234');
            expect(mergeSummarizedStats(summarized, players)._2019[1].hr).toBe(11);
        });

        test('mergeSummarizedStats with no history of recorded entries', () => {
            summarized._01 = null;
            expect(mergeSummarizedStats(summarized, players)._01.length).toBe(1);
        });

        test('mergeSummarizedStats should not merge leaderboard stats', () => {
            summarized._leaderboard_2020 = {};
            expect(mergeSummarizedStats(summarized, players)._leaderboard_2020).toBe(undefined);
            expect(Object.keys(mergeSummarizedStats(summarized, players)).length).toBe(1);
        });
    });
});
