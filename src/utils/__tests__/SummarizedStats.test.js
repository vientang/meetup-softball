import { getSummarizedIds, mergeSummarizedStats } from '../SummarizeStats';

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

    test('mergeSummarizedStats for existing player', () => {
        const summarized = {
            _2019: [
                {
                    id: '123',
                    name: 'Fresh Basta',
                    hr: '10',
                },
            ],
        };
        const stats = [
            {
                id: '123',
                name: 'Fresh Basta',
                games: [
                    {
                        hr: '10',
                    },
                ],
            },
        ];
        expect(mergeSummarizedStats(stats, summarized)._2019[0].hr).toBe(20);
    });

    test('mergeSummarizedStats for new player', () => {
        const summarized = {
            _2019: [
                {
                    id: '123',
                    name: 'Fresh Basta',
                    hr: '10',
                },
            ],
        };
        const stats = [
            {
                id: '234',
                name: 'Steven',
                games: [
                    {
                        hr: '10',
                    },
                ],
            },
        ];
        
        expect(mergeSummarizedStats(stats, summarized)._2019[0].hr).toBe(10);
    });
});
