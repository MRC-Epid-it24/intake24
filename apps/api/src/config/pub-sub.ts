import type { RedisOptions } from 'ioredis';

export type PublisherConfig = {
  redis: RedisOptions;
  channel: string;
};

export type SubscriberConfig = {
  redis: RedisOptions;
  channel: string;
};

export const publisherConfig: PublisherConfig = {
  redis: {
    host: process.env.PUBLISHER_REDIS_HOST || 'localhost',
    port: Number.parseInt(process.env.PUBLISHER_REDIS_PORT || '6379', 10),
  },
  channel: process.env.PUB_SUB_CHANNEL_NAME || 'index-builder',
};

export const subscriberConfig: SubscriberConfig = {
  redis: {
    host: process.env.SUBSCRIBER_REDIS_HOST || 'localhost',
    port: Number.parseInt(process.env.SUBSCRIBER_REDIS_PORT || '6379', 10),
  },
  channel: process.env.PUB_SUB_CHANNEL_NAME || 'index-builder',
};
