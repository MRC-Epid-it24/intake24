import type { IoC } from '@intake24/api/ioc';

import HasRedisClient from './redis-store';

export default class RedisStream extends HasRedisClient {
  private readonly stream: string;
  constructor({ streamConfig, logger }: Pick<IoC, 'streamConfig' | 'logger'>) {
    super({ config: streamConfig.redis, logger: logger.child({ service: 'Redis-Stream' }) });
    this.stream = streamConfig.stream;
  }

  /**
   * Add message to the end of the stream
   * @param {string} message
   * @returns {Promise<string>}
   * */
  async add(key: string, message: string): Promise<string | null> {
    return this.redis.xadd(this.stream, '*', 'message', message);
  }

  /**
   * Read all messages from the stream
   * @returns {Promise<void>}
   * */
  async read(): Promise<string[]> {
    const localesIds: string[] = [];
    let lastId = '0-0';

    let continueReading = true;
    while (continueReading) {
      const stream = await this.redis.xread('BLOCK', 5000, 'STREAMS', this.stream, lastId);
      if (stream) {
        const messages = stream[0][1];
        for (const message of messages) {
          const [id, messageData] = message;
          const locale = messageData[1]; // Assuming the message is structured as ['locale', 'en_AU']
          localesIds.push(locale);
          lastId = id;
        }

        // Clear the stream
        await this.redis.xtrim(this.stream, 'MINID', lastId);
      } else {
        continueReading = false;
      }
    }
    return localesIds;
  }
}
