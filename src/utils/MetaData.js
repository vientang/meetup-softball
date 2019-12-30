import { updateMetaDataEntry } from './apiService';
import { findPlayerById } from './helpers';
import { updateGamesPlayed } from './statsCalc';

export default {
    save: async (metadata, currentGame, winners, losers) => {
        const players = winners.concat(losers);
        const activePlayers = updateActivePlayers(metadata, players);
        const inactivePlayers = updateInactivePlayers(metadata, players);
        const recentGames = updateRecentGames(metadata, currentGame, winners, losers);
        const allFields = updateAllFields(metadata, currentGame);
        const allYears = updateAllYears(metadata, currentGame);
        const perYear = updateFieldsMonthsPerYear(metadata, currentGame);
        const data = {
            id: '_metadata',
            activePlayers: JSON.stringify(activePlayers),
            inactivePlayers: JSON.stringify(inactivePlayers),
            allFields: JSON.stringify(allFields),
            allYears: JSON.stringify(allYears),
            perYear: JSON.stringify(perYear),
            recentGames: JSON.stringify(recentGames),
            recentGamesLength: recentGames.length,
            totalGamesPlayed: metadata.totalGamesPlayed + 1,
            totalPlayersCount: activePlayers.length + inactivePlayers.length,
        };

        try {
            await updateMetaDataEntry({ input: data });
        } catch (e) {
            throw new Error(`Error saving meta data: ${e}`);
        }
    },
};

export function updateActivePlayers(metadata, players) {
    const activePlayers = JSON.parse(metadata.activePlayers);
    const inactivePlayers = JSON.parse(metadata.inactivePlayers);
    return activePlayers.reduce((acc, player) => {
        const { id, name, gp, photos } = player;

        // check if active player is listed in the current game
        const activePlayer = findPlayerById(id, players);
        // find player in the current game that is listed in the inactivePlayers list
        const inactivePlayer = players.find((p) => !!findPlayerById(p.id, inactivePlayers));

        if (activePlayer || inactivePlayer) {
            acc.push({
                gp: updateGamesPlayed(gp),
                id,
                name,
                photos,
            });
            return acc;
        }
        acc.push(player);
        return acc;
    }, []);
}

export function updateAllFields(metadata, currentGame) {
    // TODO: use regex to find field in metadata
    // Gellert Park should be recorded as Gellert
    // make sure currentGame.field first letter is capitalized
    return { ...JSON.parse(metadata.allFields), [currentGame.field]: currentGame.field };
}

export function updateAllYears(metadata, currentGame) {
    return { ...JSON.parse(metadata.allYears), [currentGame.year]: currentGame.year };
}

/**
 * Find and remove current game players from inactive list
 * @param {*} metadata
 * @param {*} players - current game players
 */
export function updateInactivePlayers(metadata, players) {
    return JSON.parse(metadata.inactivePlayers).filter(
        (player) => !findPlayerById(player.id, players),
    );
}

export function updateFieldsMonthsPerYear(metadata, currentGame) {
    const { year, month, field } = currentGame;
    const perYear = JSON.parse(metadata.perYear);
    const currentYear = { ...perYear[year] };
    currentYear.gp += 1;
    currentYear.months =
        currentYear.months[currentYear.months.length - 1] === month
            ? [...currentYear.months]
            : [...currentYear.months, month];
    currentYear.fields = currentYear.fields[field]
        ? { ...currentYear.fields, [field]: currentYear.fields[field] + 1 }
        : { ...currentYear.fields, [field]: 1 };
    return { ...perYear, [year]: currentYear };
}

export function updateRecentGames(metadata, currentGame, winners, losers) {
    const { recentGames, recentGamesLength } = metadata;
    const recent = JSON.parse(recentGames).slice(0, recentGamesLength - 1);
    const game = { ...currentGame };
    game.winners = winners;
    game.losers = losers;

    return [game, ...recent];
}
