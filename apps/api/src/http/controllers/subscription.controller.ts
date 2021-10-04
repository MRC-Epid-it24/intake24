import { Request, Response } from 'express';
import { User, UserSubscription } from '@api/db/models/system';
import type { IoC } from '@api/ioc';
import { Controller } from './controller';

export type SubscriptionController = Controller<'push' | 'subscribe' | 'unsubscribe'>;

export default ({ pusher }: Pick<IoC, 'pusher'>): SubscriptionController => {
  const push = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.user as User;

    await pusher.webPush(id, {
      title: '🚀 Push notification!',
      body: `We'll keep you updated whenever your tasks are finished.`,
    });

    res.json();
  };

  const subscribe = async (req: Request, res: Response): Promise<void> => {
    const { id: userId } = req.user as User;
    const { subscription } = req.body;

    const type = 'web-push';

    const subscriptions = await UserSubscription.findAll({
      where: { userId, type, subscription: JSON.stringify(subscription) },
    });

    if (!subscriptions.length) await UserSubscription.create({ userId, type, subscription });

    res.json();
  };

  const unsubscribe = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.user as User;

    await UserSubscription.destroy({ where: { userId: id, type: 'web-push' } });

    res.status(204).json();
  };

  return { push, subscribe, unsubscribe };
};
