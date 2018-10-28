const players = [
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

const makeData = () => {
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

export default {
	makeData,
	sortByNameLength,
}
