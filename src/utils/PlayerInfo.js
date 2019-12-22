import pick from 'lodash/pick';
import { createNewPlayerInfo, fetchPlayerInfo } from './apiService';

export default {
    save: async (players, winners, losers) => {
        // const players = winners.concat(losers);
        await submitPlayerStats(players);
    },
};

export async function submitPlayerStats(players = []) {
    players.forEach(async (player) => {
        // check if player exists in database
        // const existingPlayer = await fetchPlayerInfo(player.id);

        try {
            await createNewPlayerInfo({
                input: {
                    ...player,
                },
            });
            // if (existingPlayer) {
            //     const playerInfo = pick(player, [
            //         'id',
            //         'name',
            //         'joined',
            //         'photos',
            //         'profile',
            //         'admin',
            //         'status',
            //         'gender',
            //     ]);

            //     await createNewPlayerInfo({
            //         input: {
            //             ...playerInfo,
            //         },
            //     });
            // }
        } catch (e) {
            throw new Error(`Error saving player ${existingPlayer.name}: ${e}`);
        }
    });
}
