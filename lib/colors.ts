import { inspect } from 'util';

// standard colour codes

export const CODE_RESET_ALL = 0;
export const CODE_RESET_INTENSITY = 22;
export const CODE_RESET_ITALIC = 23;
export const CODE_RESET_UNDERLINE = 24;
export const CODE_RESET_COLOR = 39;

export const CODE_BOLD = 1;
export const CODE_DIM = 2;
export const CODE_ITALIC = 3;
export const CODE_UNDERLINE = 4;

export const CODE_BLACK = 30;
export const CODE_RED = 31;
export const CODE_GREEN = 32;
export const CODE_YELLOW = 33;
export const CODE_BLUE = 34;
export const CODE_MAGENTA = 35;
export const CODE_CYAN = 36;
export const CODE_WHITE = 37;

/** Whether colours are enabled for the current session. */
export const COLORS_ENABLED = process.env.NO_COLOR == null
	&& process.env.TERM !== 'dumb'
	&& process.stdout.isTTY;
export const ESCAPE = '\x1b[';

/** A function which colorises the given arguments. */
export type Color = (...args: unknown[]) => string;

const stringify = (thing: unknown) => typeof thing === 'string'
	? thing
	: inspect(thing, { colors: false });
/** Creates a colorizer function for the given color code. */
export const createColor = (
	code: number | string,
	reset = 0,
): Color => Object.assign(function colorizer(...args: unknown[]) {
	const open = `${ESCAPE}${code}m`;
	const close = `${ESCAPE}${reset}m`;
	const string = args
		.map(stringify)
		.join(' ')
		.replaceAll(close, `${close}${open}`);
	return `${open}${string}${close}`;
}, { toString: ( ) => `${ESCAPE + code}m` });

export const bold = createColor(CODE_BOLD, CODE_RESET_INTENSITY);
export const dim = createColor(CODE_DIM, CODE_RESET_INTENSITY);
export const italic = createColor(CODE_ITALIC, CODE_RESET_ITALIC);
export const underline = createColor(CODE_UNDERLINE, CODE_RESET_UNDERLINE);

export const black = createColor(CODE_BLACK, CODE_RESET_COLOR);
export const red = createColor(CODE_RED, CODE_RESET_COLOR);
export const green = createColor(CODE_GREEN, CODE_RESET_COLOR);
export const yellow = createColor(CODE_YELLOW, CODE_RESET_COLOR);
export const blue = createColor(CODE_BLUE, CODE_RESET_COLOR);
export const magenta = createColor(CODE_MAGENTA, CODE_RESET_COLOR);
export const cyan = createColor(CODE_CYAN, CODE_RESET_COLOR);
export const white = createColor(CODE_WHITE, CODE_RESET_COLOR);
