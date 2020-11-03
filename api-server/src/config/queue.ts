import { ConnectionOptions } from 'bullmq';

export type QueueConfig = {
  redis: ConnectionOptions;
};

const queueConfig: QueueConfig = {
  redis: {
    host: process.env.QUEUE_REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.QUEUE_REDIS_PORT ?? '6379', 10),
  },
};

export default queueConfig;
