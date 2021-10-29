import type { Writable } from 'stream';

export type LoggerMethod = (...args: unknown[]) => void;
export type LoggerCreator = (...context: string[]) => Logger;
export interface LoggerMethods {
	/** Logs the given arguments with fatal level priority. */
	fatal: LoggerMethod;
	/** Logs the given arguments with error level priority. */
	error: LoggerMethod;
	/** Logs the given arguments with warning level priority. */
	warn: LoggerMethod;
	/** Logs the given arguments with info level priority. */
	info: LoggerMethod;
	/** Logs the given arguments with debug level priority. */
	debug: LoggerMethod;
	/** Logs the given arguments with trace level priority. */
	trace: LoggerMethod;

	/** Creates a child logging context of this logger. */
	child: LoggerCreator;
}
/** Logs a message with the default priority level. */
export type Logger = LoggerMethod & LoggerMethods;

/** The different logger levels available. */
export enum LoggerLevel {
	Trace = 0,
	Debug = 1,
	Info = 2,
	Warn = 3,
	Error = 4,
	Fatal = 5,
}

export interface LoggerConfiguration {
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
}
