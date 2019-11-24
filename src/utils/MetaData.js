import { updateMetaDataEntry } from './apiService';

export default {
    save: async (metadata, currentGame, winners, losers) => {
        const players = winners.concat(losers);
        const activePlayers = updateActivePlayers(metadata, players);
        const inactivePlayers = updateInactivePlayers(metadata, players);
        const recentGames = updateRecentGames(metadata, currentGame);

        const data = {
            id: '_metadata',
            activePlayers: JSON.stringify(activePlayers),
            inactivePlayers: JSON.stringify(inactivePlayers),
            allFields: JSON.stringify(updateAllFields(metadata, currentGame)),
            allYears: JSON.stringify(updateAllYears(metadata, currentGame)),
            perYear: JSON.stringify(updateFieldsMonthsPerYear(metadata, currentGame)),
            recentGames: JSON.stringify(recentGames),
            recentGamesLength: recentGames.length,
            totalGamesPlayed: metadata.totalGamesPlayed + 1,
            totalPlayersCount: activePlayers.length + inactivePlayers.length,
        };

        // await submitMetaData(data);
    },
};

export function updateActivePlayers(metadata, players) {
    const actives = metadata.activePlayers;
    return players
        .filter((player) => !actives.find((p) => p.id === player.id))
        .map((activePlayer) => ({
            id: activePlayer.id,
            name: activePlayer.name,
            gp: activePlayer.gp,
            photos: activePlayer.photos,
        }));
}

export function updateAllFields(metadata, currentGame) {
    // TODO: use regex to find field in metadata
    // Gellert Park should be recorded as Gellert
    // make sure currentGame.field first letter is capitalized
    return { ...metadata.allFields, [currentGame.field]: currentGame.field };
}

export function updateAllYears(metadata, currentGame) {
    return { ...metadata.allYears, [currentGame.year]: currentGame.year };
}

export function updateInactivePlayers(metadata, players) {
    const inactives = metadata.activePlayers;
    return inactives.filter((player) => !players.find((p) => p.id === player.id));
}

export function updateFieldsMonthsPerYear(metadata, currentGame) {
    const { year, month, field } = currentGame;
    const currentYear = { ...metadata.perYear[year] };
    currentYear.gp += 1;
    currentYear.months =
        currentYear.months[currentYear.months.length - 1] === month
            ? [...currentYear.months]
            : [...currentYear.months, month];
    currentYear.fields = currentYear.fields[field]
        ? { ...currentYear.fields, [field]: currentYear.fields[field] + 1 }
        : { ...currentYear.fields, [field]: 1 };
    return { ...metadata.perYear, [year]: currentYear };
}

export function updateRecentGames(metadata, currentGame) {
    const { recentGames, recentGamesLength } = metadata;
    const recent = recentGames.slice(0, recentGamesLength - 1);
    return [currentGame, ...recent];
}

export async function submitMetaData(data) {
    console.log('submitMetaData', { data });
    try {
        await updateMetaDataEntry({
            input: { ...data },
        });
    } catch (e) {
        throw new Error(`Error saving meta data: ${e}`);
    }
}
