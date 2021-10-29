import { inspect } from 'util';

import {
	bold,
	createColor,
	cyan,
	dim,
	magenta,
	red,
	yellow,
} from './colors.js';
import type { LoggerConfiguration } from './types.js';
import { LoggerLevel } from './types.js';

const COLOR_RED_BACKGROUND = 41;

const fatal = createColor(COLOR_RED_BACKGROUND);

/** Default prefixes for different logger levels. */
const DEFAULT_PREFIXES = {
	[ LoggerLevel.Trace ]: `${dim('TRC')} `,
	[ LoggerLevel.Debug ]: `${magenta('DBG')} `,
	[ LoggerLevel.Info ]: `${cyan('INF')} `,
	[ LoggerLevel.Warn ]: `${bold(yellow('WRN'))} `,
	[ LoggerLevel.Error ]: `${bold(red('ERR'))} `,
	[ LoggerLevel.Fatal ]: `${bold(fatal('FTL'))} `,
};

export const defaultLevel: NonNullable<LoggerConfiguration['level']>
	= LoggerLevel.Trace;

const time = process.env.NODE_ENV === 'production'
	? ( ) => new Date( ).toISOString( )
	: ( ) => new Date( ).toLocaleTimeString( );
export const defaultTimestamp: NonNullable<LoggerConfiguration['timestamp']>
	= ( ) => dim(`${time( )} `);

export const defaultStringify: NonNullable<LoggerConfiguration['stringify']>
	= (thing: unknown) => typeof thing === 'string' ? thing : inspect(thing);

export const defaultPrefix: NonNullable<LoggerConfiguration['prefix']>
	= (level: LoggerLevel) => DEFAULT_PREFIXES[ level ];

export const defaultStream: NonNullable<LoggerConfiguration['stream']>
	= (level: LoggerLevel) => level > LoggerLevel.Warn ? process.stderr : process.stdout;

export const defaultSeparator: NonNullable<LoggerConfiguration['separator']>
	= ' ';
