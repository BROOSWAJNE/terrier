# terrier

Terrier is a talkative little dog, which takes care of all your logging needs.
Zero dependencies. Simple, straightforward interface and API with no extra
complication.

Super simple to use:

```javascript
import { createLogger } from 'terrier';

const logger = createLogger( );
logger.debug('Initializing greeting...');
logger.info('Hello world!');
logger.trace('User greeted.');

const child = logger.child('jim');
child.debug('Doing some work...');
child.error('Child labour is illegal!');
```

Fully configurable (see the [LoggerConfiguration](./lib/types.ts) interface for
a description of all the options):

```javascript
import { intlFormat } from 'date-fns';
import { Writable } from 'stream';
import {
  LoggerLevel,
  createLogger,
} from 'terrier';

const logger = createLogger({
  // only log messages with priority 'info' or above
  level: LoggerLevel.Info,
  // custom timestamp formatting
  timestamp: ( ) => intlFormat(new Date( ), { locale: 'ko-KR' }),
  // custom output stream
  stream: (level) => new Writable(/* ... */),
});
```
