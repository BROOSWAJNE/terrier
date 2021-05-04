import { Writable } from 'stream';
import { inspect } from 'util';

import {
	bold,
	cyan,
	dim,
	magenta,
	red,
	yellow,
} from './lib/colors.js';

export type LoggerMethod = (...args: unknown[]) => void;
export type LoggerCreator = (...context: string[]) => Logger;
export interface LoggerMethods {
	/** Logs the given arguments with error level priority. */
	error: LoggerMethod;
	/** Logs the given arguments with warning level priority. */
	warn: LoggerMethod;
	/** Logs the given arguments with info level priority. */
	info: LoggerMethod;
	/** Logs the given arguments with debug level priority. */
	debug: LoggerMethod;

	/** Creates a child logging context of this logger. */
	child: LoggerCreator;
}
/** Logs a message with the default priority level. */
export type Logger = LoggerMethod & LoggerMethods;

/** The different logger levels available. */
export enum LoggerLevel {
	Debug,
	Info,
	Warn,
	Error,
}

/** Default prefixes for different logger levels. */
export const DEFAULT_PREFIXES = {
	[ LoggerLevel.Debug ]: cyan('DBG'),
	[ LoggerLevel.Info ]: magenta('INF'),
	[ LoggerLevel.Warn ]: bold(yellow('WRN')),
	[ LoggerLevel.Error ]: bold(red('ERR')),
};

const defaultTimestamp = ( ) => dim(new Date( ).toISOString( ));
const defaultStringify = (thing: unknown) => typeof thing === 'string' ? thing : inspect(thing);
const defaultPrefix = (level: LoggerLevel) => DEFAULT_PREFIXES[ level ];
const defaultStream = (level: LoggerLevel) => level > LoggerLevel.Warn
	? process.stderr
	: process.stdout;

/** Creates a new logger with the given configuration. */
export function createLogger({
	level = LoggerLevel.Debug,
	timestamp = defaultTimestamp,
	stringify = defaultStringify,
	prefix = defaultPrefix,
	stream = defaultStream,
	separator = ' ',
}: {
	/** The logger's configured level, any messages below this priority level will be ignored. */
	level?: LoggerLevel;
	/** A function which generates a string timestamp to be prepended to the the logs. */
	timestamp?: ( ) => string;
	/** A function which turns a logged argument into its string representation. */
	stringify?: (thing: unknown) => string;
	/** A function which gets the string prefix for a given logger level. */
	prefix?: (level: LoggerLevel) => string;
	/** A function which gets the target stream that a logger level should write to. */
	stream?: (level: LoggerLevel) => Writable;
	/** The separator to be inserted between context levels. */
	separator?: string;
} = { }): Logger {
	return (function createChild(...context: string[]) {
		const createMethodForLevel = (
			targetLevel: LoggerLevel,
		): LoggerMethod => function log(...args) {
			if (targetLevel < level) return; // ignored
			const target = stream(targetLevel);
			const string = args.map(stringify);
			const pre = prefix(targetLevel);
			const ctx = context.join(separator);
			target.write(`${timestamp( )}${pre}${ctx}${string}\n`);
		};

		const child = createMethodForLevel(LoggerLevel.Info);
		return Object.assign(child, {
			error: createMethodForLevel(LoggerLevel.Error),
			warn: createMethodForLevel(LoggerLevel.Warn),
			info: createMethodForLevel(LoggerLevel.Info),
			debug: createMethodForLevel(LoggerLevel.Debug),

			child: (...ctx: string[]) => createChild(...context, ...ctx),
		});
	})( );
}
