import Utils from '../Utils';
import mockData from '../mockData';

const { mockLeaderBoard } = mockData;
const { setTopLeaders, getRateStatTotal, getRunsCreatedTotal } = Utils;

describe('Leaderboard Stats', () => {
    it('Get top 5 of home runs', () => {
        expect(setTopLeaders(mockLeaderBoard, 'triples')).toEqual([
            { playerName: 'santiago', total: 3 },
            { playerName: 'carlos', total: 2 },
            { playerName: 'mike', total: 2 },
            { playerName: 'steven', total: 2 },
            { playerName: 'natcha', total: 1 },
            { playerName: 'laura', total: 1 },
            { playerName: 'vien', total: 1 },
        ]);
    });

    it('Get top 5 of rbi', () => {
        expect(setTopLeaders(mockLeaderBoard, 'rbi')).toEqual([
            { playerName: 'carlos', total: 14 },
            { playerName: 'mike', total: 8 },
            { playerName: 'vien', total: 7 },
            { playerName: 'laura', total: 5 },
            { playerName: 'steven', total: 5 },
        ]);
    });

    it('Get top 5 OPS', () => {
        expect(setTopLeaders(mockLeaderBoard, 'ops')).toEqual([
            { playerName: 'carlos', total: 2.715 },
            { playerName: 'vien', total: 2.339 },
            { playerName: 'mike', total: 2.217 },
            { playerName: 'santiago', total: 1.847 },
            { playerName: 'laura', total: 1.778 },
        ]);
    });

    it('Get top 5 Runs Created', () => {
        expect(setTopLeaders(mockLeaderBoard, 'rc')).toEqual([
            { playerName: 'carlos', total: 25.317 },
            { playerName: 'mike', total: 18.487 },
            { playerName: 'vien', total: 16.107 },
            { playerName: 'santiago', total: 12.969 },
            { playerName: 'laura', total: 11.972 },
        ]);
    });
});
