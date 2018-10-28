const code = (event) => {
	// Keyboard Events
	if (event && typeof event === 'object') {
		const keyCode = event.which || event.keyCode || event.charCode;
		return keyCode;
	}
	return event;
};

const Keys = {
	BACKSPACE: 8,
	TAB: 9,
	RETURN: 13,
	ENTER: 13,
	SHIFT: 16,
	CTRL: 17,
	ALT: 18,
	ESC: 27,
	SPACE: 32,
	PAGE_UP: 33,
	PAGE_DOWN: 34,
	END: 35,
	HOME: 36,
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	DELETE: 46,
	COMMA: 188,
	PERIOD: 190,
	A: 65,
	O: 79,
	Z: 90,
	ZERO: 48,
	NUM_0: 96,
	NUM_9: 105,
	code,
};

export default Keys;
