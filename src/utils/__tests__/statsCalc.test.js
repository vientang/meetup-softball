import statsCalc from '../statsCalc';
const { 
    getHits, 
    getAtBats, 
    getRunsCreated, 
    getTotalBases, 
    getAverage 
} = statsCalc;

describe('Stats calculations', () => {
    it ('hits', () => {
        expect(getHits(1, 2, 3, 4)).toBe(10);
        expect(getHits(0, 0, 0, 0)).toBe(0);
    });

    it ('at bats', () => {
        expect(getAtBats(1, 0)).toBe(1);
    });

    it ('total bases', () => {
        expect(getTotalBases(1, 2, 3, 4)).toBe(30);
    });

    it ('runs created', () => {
        expect(getRunsCreated(5, 1, 0, 6, 1, 5)).toBe(6.55);
    });

    it ('average', () => {
        expect(getAverage(1, 5)).toBe(".200");
    });
});