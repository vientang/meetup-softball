import { mergePlayerStats, mergeGameStats } from './statsCalc';

/**
 * Write mutations to database
 * Update player stats and game stats
 * @param {Array} meetupData - data from meetup api
 * @param {Array} currentStats - all game stats from current game
 */
const updateStats = (meetupData, currentStats) => {
	// graphql query for all player stats from database
	const playerStatsFromRecord = listPlayerStats();

	// find historical stats for players who attended the game
	const historicalStats = currentStats.find((attendee) => {
		return playerStatsFromRecord.every((player) => player.member.id === attendee.id);
	});

	// merge existing player stats with current player stats
	const playerStats = mergePlayerStats(historicalStats, currentStats);

	// append current game stats to existing list of game stats
	const gameStats = mergeGameStats(meetupData, currentStats);

	// write player stats to database
	mutatePlayerStats(playerStats);

	// write game stats to database
	mutateGameStats(gameStats);
}

const game1Players = [
	'Vien',
	'Mike',
	'Steven',
	'Cory',
	'John',
	'Jason',
	'Wynn',
	'Al',
	'Carlos',
	'Cameron',
	'Efrain',
	'Kevin H',
	'Kevin A',
	'Dale',
	'James',
	'Brendan',
	'Eli',
	'Hector',
];

const game2Players = [
	'Annabel',
	'Eida',
	'Carlos',
	'Mike B OG',
	'New Mike B',
	'Michael',
	'Dale',
	'Jessica',
	'Matthew',
	'Tall Matthew',
	'Chris',
	'Efrain',
	'Santiago',
	'Vien',
	'Earl',
	'Brendan',
	'Laura',
	'Natcha',
];

/**
 * Data model to show on AdminStatsTable
 * @param {String} player 
 * @param {Number} index 
 * @return {Object}
 */
const newPerson = (player, index) => {
	return {
        "1b": '',
		"2b": '',
        "3b": '',
		bb: '',
        cs: '',
		hr: '',
		id: `${player}${index}`,
        k: '',
        meetupId: '',
		name: player,
		o: '',
		r: '',
        rbi: '',
		sac: '',
        sb: '',
	};
};

const makeData = (game) => {
	const players = game === 1 ? game1Players : game2Players;
	return players.map((p, idx) => {
		return {
			...newPerson(p, idx),
		};
	});
};

const sortByNameLength = (a, b) => {
	if (a.length === b.length) {
		return a > b ? 1 : -1;
	}
	return a.length > b.length ? 1 : -1;
};

const mockGameStats = {
	id: 'xxxxxxxcqyxmbcb', // name.toLowerCase().slice(0, 7).split(' ').join('')_${meetup.id}
	date: new Date(), // meetup.local_date
	time: '1535823000000', // meetup.local_time
	field: 'Westlake', // meetup.venue.name
	isTournament: false, // playerStats.isTournament
	tournamentName: '', // playerStats.tournamentName
	isGameTied: false, // playerStats.isGameTied
	winners: {
		runsScored: '13',
		teamName: 'Winners', // playerStats.teamName
		players: [],
	},
	losers: {
		runsScored: '13',
		teamName: 'Losers', // playerStats.teamName
		players: [],
	}
};

export default {
	updateStats,
	makeData,
	mockGameStats,
	sortByNameLength,
}
