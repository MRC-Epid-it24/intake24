import webPush, { RequestOptions, SendResult, WebPushError } from 'web-push';
import { SubscriptionType } from '@common/types/models';
import { UserSubscription } from '@/db/models/system';
import type { IoC } from '@/ioc';

export type SubscriptionInput = {
  userId: number;
  type: SubscriptionType;
};

export type PushPayload<T = any> = {
  title: string;
  body: string;
  url?: string;
  data?: T;
};

export default class Pusher {
  private readonly servicesConfig;

  private readonly logger;

  private readonly $webPush;

  constructor({ servicesConfig, logger }: Pick<IoC, 'servicesConfig' | 'logger'>) {
    this.servicesConfig = servicesConfig;
    this.logger = logger;

    this.$webPush = webPush;
  }

  /**
   * Initialize Pusher
   *
   * @memberof Pusher
   */
  public async init(): Promise<void> {
    const { subject, publicKey, privateKey } = this.servicesConfig.webPush;
    this.$webPush.setVapidDetails(subject, publicKey, privateKey);

    this.logger.info(`Pusher has been loaded.`);
  }

  /**
   * Send push notification
   * - look up stored subscription
   * - send push notification
   * - clean non-valid subscriptions
   *
   * @param {SubscriptionInput} input
   * @param {PushPayload} payload
   * @param {RequestOptions} [options]
   * @returns {Promise<SendResult[]>}
   * @memberof Pusher
   */
  public async sendNotification(
    input: SubscriptionInput,
    payload: PushPayload,
    options?: RequestOptions
  ): Promise<SendResult[]> {
    const subscriptions = await UserSubscription.findAll({ where: input });

    const results: SendResult[] = [];

    for (const subscription of subscriptions) {
      try {
        const result = await this.$webPush.sendNotification(
          subscription.subscription,
          JSON.stringify(payload),
          options
        );
        results.push(result);
      } catch (err) {
        if ((err as WebPushError).statusCode === 410) {
          subscription.destroy().catch((dbErr) => {
            const { message, name, stack } = dbErr;
            this.logger.error(stack ?? `${name}: ${message}`);
          });
          continue;
        }

        const { message, name, stack } = err;
        this.logger.error(stack ?? `${name}: ${message}`);
      }
    }

    return results;
  }

  /**
   * Push web notification
   *
   * @param {number} userId
   * @param {PushPayload} payload
   * @param {RequestOptions} [options]
   * @returns {Promise<SendResult[]>}
   * @memberof Pusher
   */
  public webPush(
    userId: number,
    payload: PushPayload,
    options?: RequestOptions
  ): Promise<SendResult[]> {
    return this.sendNotification({ type: 'web-push', userId }, payload, options);
  }
}
