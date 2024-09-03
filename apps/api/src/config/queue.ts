import type { RedisOptions } from './redis';

export type QueueConfig = {
  redis: RedisOptions;
  workers: number;
};

const queueConfig: QueueConfig = {
  redis: {
    url: process.env.QUEUE_REDIS_URL || process.env.REDIS_URL || undefined,
    host: process.env.QUEUE_REDIS_HOST || process.env.REDIS_HOST || 'localhost',
    port: Number.parseInt(process.env.QUEUE_REDIS_PORT || process.env.REDIS_PORT || '6379', 10),
    db: Number.parseInt(process.env.QUEUE_REDIS_DATABASE || process.env.REDIS_DATABASE || '0', 10),
    keyPrefix: process.env.QUEUE_REDIS_PREFIX || 'it24:queue',
  },
  workers: Number.parseInt(process.env.QUEUE_WORKERS || '3', 10),
};

export default queueConfig;
