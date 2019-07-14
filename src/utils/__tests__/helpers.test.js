/* eslint-disable no-undef */
import { setTopLeaders, formatCellValue, createSlug } from '../helpers';
import mockData from '../mockData';

const { mockLeaderBoard } = mockData;

describe('Leaderboard Stats', () => {
    it('Get top 5 of counting stat', () => {
        expect(setTopLeaders(mockLeaderBoard, 'hr')[0].total).toBe(3);
        expect(setTopLeaders(mockLeaderBoard, 'hr')[1].total).toBe(2);
        expect(setTopLeaders(mockLeaderBoard, 'hr')[2].total).toBe(1);
        expect(setTopLeaders(mockLeaderBoard, 'hr')[3].total).toBe(1);
        expect(setTopLeaders(mockLeaderBoard, 'hr')[4].total).toBe(1);
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

describe('Format cell values', () => {
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

describe('Create slug for url', () => {
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
