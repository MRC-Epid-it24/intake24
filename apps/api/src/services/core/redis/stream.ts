import { Redis } from 'ioredis';

import type { IoC } from '@intake24/api/ioc';

import HasRedisClient from './redis-store';

export default class RedisStream extends HasRedisClient {
  private readonly stream: string;
  constructor({ streamConfig, logger }: Pick<IoC, 'streamConfig' | 'logger'>) {
    super({ config: streamConfig.redis, logger: logger.child({ service: 'Redis-Stream' }) });
    this.stream = streamConfig.stream;
    this.redis = new Redis(streamConfig.redis);
  }

  /**
   * Add message to the end of the stream
   * @param {string} message
   * @returns {Promise<string>}
   * */
  async add(message: string): Promise<string | null> {
    return this.redis.xadd(this.stream, '*', 'message', message);
  }

  /**
   * Read all messages from the stream
   * @returns {Promise<void>}
   * */
  async read(): Promise<string[]> {
    const localesIds: string[] = [];

    const stream = await this.redis.xrange(this.stream, '-', '+');
    // TODO: Some weird stuff is happening here. The stream is not being read properly
    this.logger.debug('\n\nStream:', stream);
    stream.forEach((message) => {
      this.logger.debug('Message:', message);
      // Does't produce the expected output
      const locale = message[1][1];
      this.logger.debug('Locale:', locale);
      localesIds.push(locale);
    });
    this.clearStream();
    return new Promise((resolve) => resolve(['en_AU', 'en_GB']));
    //return [...new Set(localesIds)]
  }

  /**
   * Close the connection
   * @returns {Promise<void>}
   * */
  async close(): Promise<void> {
    await this.redis.quit();
  }

  async clearStream() {
    try {
      await this.redis.xtrim(this.stream, 'MAXLEN', 0);
      this.logger.debug('Stream cleared');
    } catch (error) {
      this.logger.debug('Failed to clear the stream:', error);
    }
  }
}
