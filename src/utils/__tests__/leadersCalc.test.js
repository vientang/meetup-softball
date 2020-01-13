import { getLeaders, getInitial, getRemaining, getQualifier } from '../leadersCalc';
import mockAPIData from '../../../__mocks__/mockAPIData';

const { players } = mockAPIData;

describe('createLeaderBoard', () => {
    let stat;
    beforeEach(() => {
        stat = 'hr';
    });
    test('getInitial', () => {
        expect(getInitial(players, stat)).toStrictEqual([
            { id: '123', name: 'Fresh Basta', gp: '20', [stat]: '50' },
            { id: '567', name: 'Cara', gp: '20', [stat]: '20' },
            { id: '234', name: 'Dale', gp: '20', [stat]: '4' },
            { id: '456', name: 'Steven', gp: '20', [stat]: '3' },
            { id: '987', name: 'Vien', gp: '20', [stat]: null },
        ]);
    });

    test('getRemaining', () => {
        expect(getRemaining(players, stat)).toStrictEqual([
            { id: '888', name: 'Carlos', gp: '20', [stat]: '90' },
            { id: '555', name: 'Kevin A', gp: '2', [stat]: '80' },
            { id: '444', name: 'Peter', gp: '20', [stat]: '40' },
            { id: '789', name: 'John', gp: '20', [stat]: '20' },
            { id: '333', name: 'Natcha', gp: '20', [stat]: '2' },
            { id: '222', name: 'Santiago', gp: '20', [stat]: '0' },
        ]);
    });

    test('getQualifier', () => {
        const year = 2020;
        const rawMetadata = {
            perYear: {
                2020: {
                    gp: 20,
                },
            },
        };
        // stringify metadata to match server type
        const metadata = JSON.stringify(rawMetadata);
        expect(getQualifier(metadata, year)).toBe(20);
    });

    test('getQualifier for first game of the year', () => {
        const year = 2020;
        const rawMetadata = {
            perYear: {
                2019: {
                    gp: 20,
                },
            },
        };
        // stringify metadata to match server type
        const metadata = JSON.stringify(rawMetadata);
        expect(getQualifier(metadata, year)).toBe(1);
    });

    test('getLeaders', () => {
        expect(getLeaders(players, stat)).toStrictEqual([
            { id: '888', name: 'Carlos', gp: '20', [stat]: '90' },
            { id: '555', name: 'Kevin A', gp: '2', [stat]: '80' },
            { id: '123', name: 'Fresh Basta', gp: '20', [stat]: '50' },
            { id: '444', name: 'Peter', gp: '20', [stat]: '40' },
            { id: '789', name: 'John', gp: '20', [stat]: '20' },
            { id: '567', name: 'Cara', gp: '20', [stat]: '20' },
        ]);
    });

    test('getLeaders with qualifier for rate stats', () => {
        stat = 'avg';
        const qualifier = 20;
        expect(getLeaders(players, stat, qualifier)).toStrictEqual([
            { id: '888', name: 'Carlos', gp: '20', [stat]: '.700' },
            { id: '123', name: 'Fresh Basta', gp: '20', [stat]: '.600' },
            { id: '789', name: 'John', gp: '20', [stat]: '.550' },
            { id: '567', name: 'Cara', gp: '20', [stat]: '.510' },
            { id: '444', name: 'Peter', gp: '20', [stat]: '.500' },
        ]);
    });

    test('getLeaders with valid stats', () => {
        stat = 'sb';
        expect(getLeaders(players, stat)).toStrictEqual([
            { id: '123', name: 'Fresh Basta', gp: '20', [stat]: '10' },
            { id: '456', name: 'Steven', gp: '20', [stat]: '8' },
            { id: '567', name: 'Cara', gp: '20', [stat]: '6' },
        ]);
    });

    test('getLeaders returns nobody', () => {
        stat = 'k';
        expect(getLeaders(players, stat)).toStrictEqual([]);
    });
});
