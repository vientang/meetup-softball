import { createNewPlayerInfo, fetchPlayerInfo, updateExistingPlayerInfo } from './apiService';

export default {
    save: async (winners, losers) => {
        const players = winners.concat(losers);
        await submitPlayerInfo(players);
    },
};

export async function submitPlayerInfo(players = []) {
    players.forEach(async (player) => {
        const { admin, gender, id, joined, name, status } = player;
        const photos = JSON.stringify(player.photos);
        const profile = JSON.stringify(player.profile);

        const existingPlayer = await fetchPlayerInfo(player.id);
        try {
            if (existingPlayer) {
                // keep photos and profile up to date with meetup
                await updateExistingPlayerInfo({
                    input: {
                        id,
                        photos,
                        profile,
                    },
                });
            } else {
                await createNewPlayerInfo({
                    input: {
                        id,
                        name,
                        joined,
                        profile,
                        admin,
                        photos,
                        status,
                        gender: gender || 'n/a',
                    },
                });
            }
        } catch (e) {
            throw new Error(`Error saving player ${player.name}`, e);
        }
    });
}
