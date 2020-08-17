import path from 'path';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import config from '@/config/app';

const silent = config.env === 'test';

const logFormat = format.printf(
  ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`
);

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat
  ),
  transports: [
    new transports.DailyRotateFile({
      dirname: path.resolve('storage/logs'),
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '10m',
      maxFiles: '30d',
      silent,
    }),
    new transports.DailyRotateFile({
      level: 'error',
      dirname: path.resolve('storage/logs'),
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '10m',
      maxFiles: '30d',
      silent,
    }),
    new transports.Console({
      level: 'debug',
      format: format.combine(
        format.colorize(),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat
      ),
      silent,
    }),
  ],
  exitOnError: false,
});

export const httpLogger = {
  write: (message: string): void => {
    logger.info(message.trim());
  },
};

export const dbLogger = (sql: string, timing?: number): void => {
  logger.debug(sql);
};

export default logger;
