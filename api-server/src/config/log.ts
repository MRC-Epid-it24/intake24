export type LogConfig = {
  level: string;
};

const logConfig: LogConfig = {
  level: process.env.LOG_LEVEL || 'debug',
};

export default logConfig;
