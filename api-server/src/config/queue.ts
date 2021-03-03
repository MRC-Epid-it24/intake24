import { RedisOptions } from 'bullmq';

export type QueueConfig = {
  redis: RedisOptions;
  workers: number;
};

const queueConfig: QueueConfig = {
  redis: {
    host: process.env.QUEUE_REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.QUEUE_REDIS_PORT ?? '6379', 10),
  },
  workers: parseInt(process.env.QUEUE_WORKERS ?? '3', 10),
};

export default queueConfig;
