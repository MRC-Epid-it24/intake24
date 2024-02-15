import Redis from 'ioredis';

import type { IoC } from '@intake24/api/ioc';

import HasRedisClient from './redis-store';

export class RedisPublisher extends HasRedisClient {
  private readonly channelName: string;

  constructor({ publisherConfig, logger }: Pick<IoC, 'publisherConfig' | 'logger'>) {
    super({ config: publisherConfig.redis, logger: logger.child({ service: 'Redis-Publisher' }) });
    this.channelName = publisherConfig.channel;
  }

  // Publish a message to a channel
  async publish(messagesArray: string[]) {
    const serializedMessages = JSON.stringify(messagesArray);
    return this.redis.publish(this.channelName, serializedMessages);
  }
}

export class RedisSubscriber extends HasRedisClient {
  private readonly channelName: string;

  constructor({ subscriberConfig, logger }: Pick<IoC, 'subscriberConfig' | 'logger'>) {
    super({ config: subscriberConfig.redis, logger: logger.child({ service: 'Redis-Publisher' }) });
    this.channelName = subscriberConfig.channel;
    // this.redis.on('message', (channel, message) => {
    //   if (channel === this.channelName) {
    //     this.onMessageReceive(message);
    //   }
    // });
  }

  // Initialize the subscriber & Overwrite the init method
  init() {
    this.redis = super.init();
    return this.redis.on('message', (channel, message) => {
      if (channel === this.channelName) {
        this.onMessageReceive(message);
      }
    });
  }

  // Subscribe to a channel
  async subscribeToChannel() {
    return this.redis.subscribe(this.channelName, (error, count) => {
      if (error) {
        // Handle subscription error
        this.logger.error('Failed to subscribe: ', error);
        return;
      }
      this.logger.info(
        `Subscribed to ${count} channel(s). Waiting for updates on the '${this.channelName}' channel.`
      );
    });
  }

  public async onMessageReceive(message: string): Promise<string[]> {
    this.logger.debug(`Received a message from '${this.channelName}' channel.`);
    // Deserialize the message back into an array of strings
    const messagesArray: string[] = JSON.parse(message);
    // Process the array as needed
    this.logger.info('Received array:', messagesArray);
    return messagesArray;
  }
}
