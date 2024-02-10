import type { RedisOptions } from 'ioredis';

export type SetConfig = {
  redis: RedisOptions;
  setName: string;
  channel: string;
};

export const setConfig: SetConfig = {
  redis: {
    host: process.env.SET_REDIS_HOST || 'localhost',
    port: parseInt(process.env.SET_REDIS_PORT || '6379', 10),
  },
  setName: process.env.SET_REDIS_NAME || 'reindex:set',
  channel: process.env.PUB_SUB_CHANNEL_NAME || 'index-builder',
};

export default setConfig;
