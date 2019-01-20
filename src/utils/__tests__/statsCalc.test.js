import statsCalc from '../statsCalc';
const { 
    getHits, 
    getAtBats, 
    getRunsCreated, 
    getTotalBases, 
    getAverage,
    getOnBasePercentage,
    getSlugging,
    getOPS,
    getWOBA
} = statsCalc;

describe('Stats calculations', () => {
    it ('hits', () => {
        expect(getHits(1, 2, 3, 4)).toBe(10);
        expect(getHits(0, 0, 0, 0)).toBe(0);
        expect(getHits(1, 1, 0, 1)).toBe(3);
    });

    it ('at bats', () => {
        expect(getAtBats(1, 0)).toBe(1);
        expect(getAtBats(90, 45)).toBe(135);
        expect(getAtBats(0, 0)).toBe(0);
    });

    it ('total bases', () => {
        expect(getTotalBases(1, 2, 3, 4)).toBe(30);
        expect(getTotalBases(0, 0, 0, 0)).toBe(0);
        expect(getTotalBases(10, 10, 10, 10)).toBe(100);
    });

    it ('runs created', () => {
        expect(getRunsCreated(5, 1, 0, 6, 1, 5)).toBe(6.55);
        expect(getRunsCreated(5, 0, 0, 6, 1, 0)).toBe(0);
    });

    it ('calculate average', () => {
        expect(getAverage(1, 5)).toBe(0.200);
        expect(getAverage(1, 0)).toBe(0.000);
        expect(getAverage(0, 8)).toBe(0.000);

    });

    it ('calculate on base percentage', () => {
        expect(getOnBasePercentage(2, 1, 2, 0)).toBe(1.000);
        expect(getOnBasePercentage(0, 0, 0, 0)).toBe(.000);
        expect(getOnBasePercentage(1, 1, 1, 1)).toBe(.667);
    });
  
    it ('calculate slugging percentage', () => {
        expect(getSlugging(2, 1)).toBe(2.000);
        expect(getSlugging(0, 0)).toBe(.000);
        expect(getSlugging(10, 10)).toBe(1.000);
    });
  
    it ('calculate OPS', () => {
        expect(getOPS(.250, .500)).toBe(.750);
        expect(getOPS(.000, .000)).toBe(.000);
        expect(getOPS(.450, .725)).toBe(1.175);
    });

    it ('calculate wOBA', () => {
        expect(getWOBA(1, 1, 1, 1, 1, 4, 1)).toBe(1.094);
        expect(getWOBA(0, 0, 0, 0, 0, 0, 0)).toBe(.000);
    });
});