import { createNewPlayerInfo, fetchPlayerInfo, updateExistingPlayerInfo } from './apiService';

export default {
    save: async (players, winners, losers) => {
        // const players = winners.concat(losers);
        await submitPlayerInfo(players);
    },
};

export async function submitPlayerInfo(players = []) {
    players.forEach(async (player) => {
        const existingPlayer = await fetchPlayerInfo(player.id);

        try {
            if (existingPlayer) {
                await updateExistingPlayerInfo({
                    input: {
                        id: player.id,
                        photos: player.photos,
                        profile: player.profile,
                    },
                });
            } else {
                await createNewPlayerInfo({ input: player });
            }
        } catch (e) {
            throw new Error(`Error saving player ${player.name}: ${e[0].message}`);
        }
    });
}
