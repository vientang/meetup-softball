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

// returns an array of len numbers, starting from 0
const range = len => {
	const arr = [];
	for (let i = 0; i < len; i++) {
		arr.push(i);
	}
	return arr;
};

const newPerson = (player) => {
	return {
		player,
		gameId: '',
		o: '',
		"1b": '',
		"2b": '',
		"3b": '',
		hr: '',
		rbi: '',
		r: '',
		bb: '',
		k: '',
		sb: '',
		cs: '',
		ab: '',
	};
};

const makeData = (game) => {
	const players = game === 1 ? game1Players : game2Players;
	return players.map((p) => {
		return {
			...newPerson(p),
			//children: range(10).map(newPerson)
		};
	});
};

const sortByNameLength = (a, b) => {
	if (a.length === b.length) {
		return a > b ? 1 : -1;
	}
	return a.length > b.length ? 1 : -1;
};

console.log('make datat', makeData(1));
export default {
	makeData,
	sortByNameLength,
}
