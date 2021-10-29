import type {
	Logger,
	LoggerConfiguration,
	LoggerMethod,
} from './lib/types.js';
import {
	defaultLevel,
	defaultPrefix,
	defaultSeparator,
	defaultStream,
	defaultStringify,
	defaultTimestamp,
} from './lib/defaults.js';
import { LoggerLevel } from './lib/types.js';

export * from './lib/colors.js';
export * from './lib/defaults.js';
export * from './lib/types.js';

/** Creates a new logger with the given configuration. */
export function createLogger({
	level = defaultLevel,
	timestamp = defaultTimestamp,
	stringify = defaultStringify,
	prefix = defaultPrefix,
	stream = defaultStream,
	separator = defaultSeparator,
}: LoggerConfiguration = { }): Logger {
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
			fatal: createMethodForLevel(LoggerLevel.Fatal),
			error: createMethodForLevel(LoggerLevel.Error),
			warn: createMethodForLevel(LoggerLevel.Warn),
			info: createMethodForLevel(LoggerLevel.Info),
			debug: createMethodForLevel(LoggerLevel.Debug),
			trace: createMethodForLevel(LoggerLevel.Trace),

			child: (...ctx: string[]) => createChild(...context, ...ctx),
		});
	})( );
}
