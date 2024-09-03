import type { RedisOptions } from './redis';

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
    url: process.env.PUBLISHER_REDIS_URL || process.env.REDIS_URL || undefined,
    host: process.env.PUBLISHER_REDIS_HOST || process.env.REDIS_HOST || 'localhost',
    port: Number.parseInt(process.env.PUBLISHER_REDIS_PORT || process.env.REDIS_PORT || '6379', 10),
    db: Number.parseInt(process.env.PUBLISHER_DATABASE || process.env.REDIS_DATABASE || '0', 10),
  },
  channel: process.env.PUB_SUB_CHANNEL_NAME || 'index-builder',
};

export const subscriberConfig: SubscriberConfig = {
  redis: {
    url: process.env.SUBSCRIBER_REDIS_URL || process.env.REDIS_URL || undefined,
    host: process.env.SUBSCRIBER_REDIS_HOST || process.env.REDIS_HOST || 'localhost',
    port: Number.parseInt(process.env.SUBSCRIBER_REDIS_PORT || process.env.REDIS_PORT || '6379', 10),
    db: Number.parseInt(process.env.SUBSCRIBER_DATABASE || process.env.REDIS_DATABASE || '0', 10),
  },
  channel: process.env.PUB_SUB_CHANNEL_NAME || 'index-builder',
};
