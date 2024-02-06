import type { RedisOptions } from 'ioredis';

export type StreamConfig = {
  redis: RedisOptions;
  stream: string;
};

export const streamConfig: StreamConfig = {
  redis: {
    host: process.env.STREAM_REDIS_HOST || 'localhost',
    port: parseInt(process.env.STREAM_REDIS_PORT || '6379', 10),
  },
  stream: process.env.STREAM_REDIS_NAME || 'reindex-stream',
};

export default streamConfig;
