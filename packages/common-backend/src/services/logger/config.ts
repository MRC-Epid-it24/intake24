export type LogConfig = {
  level: string;
  dir: string;
};

export const logConfig: LogConfig = {
  level: process.env.LOG_LEVEL || 'debug',
  dir: process.env.LOG_DIR || 'storage/logs',
};

export default logConfig;
