import type { RedisOptions } from 'ioredis';

export type QueueConfig = {
  redis: RedisOptions;
  workers: number;
};

const queueConfig: QueueConfig = {
  redis: {
    host: process.env.QUEUE_REDIS_HOST || 'localhost',
    port: Number.parseInt(process.env.QUEUE_REDIS_PORT || '6379', 10),
  },
  workers: Number.parseInt(process.env.QUEUE_WORKERS || '3', 10),
};

export default queueConfig;
