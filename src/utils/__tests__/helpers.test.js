/* eslint-disable no-undef */
import { formatCellValue, createSlug } from '../helpers';

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
