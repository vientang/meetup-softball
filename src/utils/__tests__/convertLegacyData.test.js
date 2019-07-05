/* eslint-disable no-undef */
import { convertLegacyPlayerData } from '../convertLegacyData';
import legacyData from '../../../__mocks__/mockData';

xdescribe('Legacy data', () => {
    beforeEach(() => {
        clearlegacyPlayerList();
    });

    it('equal size as input data', async () => {
        const convertedData = await convertLegacyPlayerData(legacyData);
        expect(convertedData.size).toBe(legacyData.length);
    });
});
