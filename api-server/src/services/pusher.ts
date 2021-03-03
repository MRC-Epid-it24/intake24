import webPush, { RequestOptions, SendResult, WebPushError } from 'web-push';
import { SubscriptionType } from '@common/types/models';
import { UserSubscription } from '@/db/models/system';
import type { IoC } from '@/ioc';

export type SubscriptionInput = {
  userId: number | string;
  type: SubscriptionType;
};

export type PushPayload = {
  title: string;
  body: string;
};

export default class Pusher {
  private readonly config;

  private readonly logger;

  private readonly webPush;

  constructor({ config, logger }: Pick<IoC, 'config' | 'logger'>) {
    this.config = config;
    this.logger = logger;

    this.webPush = webPush;
  }

  /**
   * Initialize Pusher
   *
   * @memberof Pusher
   */
  public async init(): Promise<void> {
    const { subject, publicKey, privateKey } = this.config.services.webPush;
    this.webPush.setVapidDetails(subject, publicKey, privateKey);

    this.logger.info(`Pusher has been loaded.`);
  }

  /**
   * Send push notification
   * - looks up stored subscription
   * - tries to send push notification
   * - cleans non-valid subscriptions
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
        const result = await this.webPush.sendNotification(
          subscription.subscription,
          JSON.stringify(payload),
          options
        );
        results.push(result);
      } catch (err) {
        if ((err as WebPushError).statusCode === 410) {
          subscription.destroy().catch((dbErr) => {
            this.logger.error(dbErr);
          });
          continue;
        }

        this.logger.warn(err);
      }
    }

    return results;
  }
}
