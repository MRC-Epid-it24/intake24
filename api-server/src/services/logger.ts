import path from 'path';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import config from '@api-server/config';

const silent = config.app.env === 'test';
const dirname = path.resolve(config.filesystem.local.logs);

const logFormat = format.printf(
  ({ level, message, timestamp, service }) =>
    `${timestamp} ${level}${service ? ` ${service}` : ''}: ${message}`
);

const logger = createLogger({
  level: config.logConfig.level,
  format: format.combine(format.timestamp(), format.json()),
  silent,
  transports: [
    new transports.DailyRotateFile({
      dirname,
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '10m',
      maxFiles: '30d',
    }),
    new transports.DailyRotateFile({
      level: 'error',
      dirname,
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '10m',
      maxFiles: '30d',
    }),
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat
      ),
    }),
  ],
  exitOnError: false,
});

export const httpLogger = {
  write: (message: string): void => {
    logger.child({ service: 'Http' }).info(message.trim());
  },
};

export const dbLogger = (sql: string): void => {
  logger.child({ service: 'Database' }).debug(sql);
};

export default logger;
