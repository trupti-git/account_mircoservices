import { createLogger, format, transports } from 'winston';
import { env } from './config.js';

const { combine, timestamp, label } = format;
const loglevel = env.LOGGING_LEVEL || 'info';
export const logger = createLogger({
  format: combine(
    label({ label: 'account service' }),
    timestamp(),
    format.logstash()
  ),
  level: loglevel,
  transports: [new transports.Console()],
});
