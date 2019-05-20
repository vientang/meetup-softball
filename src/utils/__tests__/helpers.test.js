/* eslint-disable no-undef */
import { setTopLeaders, formatCellValue, createSlug } from '../helpers';
import mockData from '../mockData';

const { mockLeaderBoard } = mockData;

describe('Leaderboard Stats', () => {
    it('Get top 5 of home runs', () => {
        expect(setTopLeaders(mockLeaderBoard, 'hr')).toEqual([
            { playerName: 'carlos', total: 3 },
            { playerName: 'vien', total: 2 },
            { playerName: 'steven', total: 1 },
            { playerName: 'laura', total: 1 },
            { playerName: 'mike', total: 1 },
        ]);
    });

    it('Get top 5 of rbi', () => {
        expect(setTopLeaders(mockLeaderBoard, 'rbi')).toEqual([
            { playerName: 'carlos', total: 14 },
            { playerName: 'mike', total: 8 },
            { playerName: 'vien', total: 7 },
            { playerName: 'steven', total: 5 },
            { playerName: 'laura', total: 5 },
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

describe('Helpers', () => {
    it('remove leading zero', () => {
        expect(formatCellValue('0.123')).toEqual('.123');
    });

    it('add trailing zero', () => {
        expect(formatCellValue('1.1')).toEqual('1.10');
    });

    it('remove extra trailing digits', () => {
        expect(formatCellValue('1.123123')).toEqual('1.12');
    });

    it('create a slug for url', () => {
        expect(createSlug('basta Fresh')).toEqual('basta_fresh');
    });
});
