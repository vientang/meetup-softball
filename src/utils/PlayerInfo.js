import { createNewPlayerInfo, fetchPlayerInfo, updateExistingPlayerInfo } from './apiService';

export default {
    save: async (winners, losers) => {
        const players = winners.concat(losers);
        players.forEach(async (player) => {
            const { admin, gender, id, joined, name } = player;
            const photos = JSON.stringify(player.photos);
            const profile = JSON.stringify(player.profile);
            const active = 'active';
            const existingPlayer = await fetchPlayerInfo(player.id);
            console.log('PlayerInfo player', { player, existingPlayer });
            // try {
            //     if (existingPlayer) {
            //         // keep photos and profile up to date with meetup
            //         await updateExistingPlayerInfo({
            //             input: {
            //                 id,
            //                 photos,
            //                 profile,
            //                 status: active,
            //             },
            //         });
            //     } else {
            //         await createNewPlayerInfo({
            //             input: {
            //                 id,
            //                 name,
            //                 joined,
            //                 profile,
            //                 admin,
            //                 photos,
            //                 status: active,
            //                 gender: gender || 'n/a',
            //             },
            //         });
            //     }
            // } catch (e) {
            //     throw new Error(`Error saving player ${player.name}`, e);
            // }
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

// export async function submitPlayerInfo(players = []) {
//     players.forEach(async (player) => {
//         const { admin, gender, id, joined, name } = player;
//         const photos = JSON.stringify(player.photos);
//         const profile = JSON.stringify(player.profile);
//         const active = 'active';
//         const existingPlayer = await fetchPlayerInfo(player.id);
//         try {
//             if (existingPlayer) {
//                 // keep photos and profile up to date with meetup
//                 await updateExistingPlayerInfo({
//                     input: {
//                         id,
//                         photos,
//                         profile,
//                         status: active,
//                     },
//                 });
//             } else {
//                 await createNewPlayerInfo({
//                     input: {
//                         id,
//                         name,
//                         joined,
//                         profile,
//                         admin,
//                         photos,
//                         status: active,
//                         gender: gender || 'n/a',
//                     },
//                 });
//             }
//         } catch (e) {
//             throw new Error(`Error saving player ${player.name}`, e);
//         }
//     });
// }
