import type { IoC } from '@intake24/api/ioc';

import HasRedisClient from './redis-store';

export class Publisher extends HasRedisClient {
  private readonly channelName: string;

  constructor({ publisherConfig, logger }: Pick<IoC, 'publisherConfig' | 'logger'>) {
    super({ config: publisherConfig.redis, logger: logger.child({ service: 'Redis-Publisher' }) });
    this.channelName = publisherConfig.channel;
  }

  /**
   * Publish a message to a channel
   *
   * @param {string[]} messagesArray
   * @returns
   * @memberof Publisher
   */
  async publish(messagesArray: string[]) {
    const serializedMessages = JSON.stringify(messagesArray);
    return this.redis.publish(this.channelName, serializedMessages);
  }
}

export class Subscriber extends HasRedisClient {
  private readonly channelName: string;
  private readonly foodIndex;

  constructor({
    foodIndex,
    logger,
    subscriberConfig,
  }: Pick<IoC, 'foodIndex' | 'logger' | 'subscriberConfig'>) {
    super({ config: subscriberConfig.redis, logger: logger.child({ service: 'Redis-Publisher' }) });
    this.channelName = subscriberConfig.channel;
    this.foodIndex = foodIndex;
  }

  // Subscribe to a channel
  async subscribeToChannel() {
    this.redis
      .on('message', (channel, message) => {
        if (channel === this.channelName)
          this.onMessageReceive(message);
      })
      .subscribe(this.channelName, (error, count) => {
        if (error) {
          // Handle subscription error
          this.logger.error('Failed to subscribe: ', error);
          return;
        }
        this.logger.info(
          `Subscribed to ${count} channel(s). Waiting for updates on the '${this.channelName}' channel.`,
        );
      });
  }

  private async onMessageReceive(message: string): Promise<string[]> {
    const localeIds = JSON.parse(message);
    if (localeIds.length === 0)
      return localeIds;
    if (localeIds.includes('all'))
      await this.foodIndex.rebuild();
    else
      await this.foodIndex.rebuildSpecificLocales(localeIds);

    return localeIds;
  }
}
