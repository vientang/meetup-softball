import { createNewPlayerInfo, fetchPlayerInfo, updateExistingPlayerInfo } from './apiService';

export default {
    save: async (players) => {
        // combine players from rsvp list with players added by admin
        players.forEach(async (player) => {
            const { admin, gender, id, joined, name } = player;
            const photos = JSON.stringify(player.photos);
            const profile = JSON.stringify(player.profile);
            const status = 'active';
            const existingPlayer = await fetchPlayerInfo(player.id);
            const input = {
                id,
                name,
                photos,
                profile,
                status,
            };
            try {
                if (existingPlayer) {
                    // keep photos and profile up to date with meetup
                    await updateExistingPlayerInfo({ input });
                } else {
                    const newPlayerInput = { ...input, joined, admin, gender: gender || 'n/a' };
                    await createNewPlayerInfo({ input: newPlayerInput });
                }
            } catch (e) {
                throw new Error(`Error saving player ${player.name}`, e);
            }
        });
    },
};

/**
 * Mark a player as active or inactive based on metadata
 * @param {*} players
 * @param {*} metadata
 */
export async function updateStatus(players, metadata) {
    const inactivePlayers = JSON.parse(metadata.inactivePlayers);
    const reclassifiedPlayers = players.items.map((player) => {
        const inactive = inactivePlayers.some((p) => p.id === player.id);
        return inactive ? { ...player, status: 'inactive' } : player;
    });

    try {
        reclassifiedPlayers.forEach(async (player) => {
            const { id, status } = player;
            await updateExistingPlayerInfo({
                input: {
                    id,
                    status,
                },
            });
        });
    } catch (e) {
        throw new Error(`Error saving player ${player.name}`, e);
    }
}
