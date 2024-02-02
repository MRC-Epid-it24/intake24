import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import { UserSubscription } from '@intake24/db';

const subscriptionController = ({ pusher }: Pick<IoC, 'pusher'>) => {
  const push = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.scope.cradle.user;

    await pusher.webPush(userId, {
      title: '🚀 Push notification!',
      body: `We'll keep you updated whenever your tasks are finished.`,
    });

    res.json();
  };

  const subscribe = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.scope.cradle.user;
    const { subscription } = req.body;

    const type = 'web-push';

    const subscriptions = await UserSubscription.findAll({
      attributes: ['id'],
      where: { userId, type, subscription: JSON.stringify(subscription) },
    });

    if (!subscriptions.length) await UserSubscription.create({ userId, type, subscription });

    res.json();
  };

  const unsubscribe = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.scope.cradle.user;

    await UserSubscription.destroy({ where: { userId, type: 'web-push' } });

    res.status(204).json();
  };

  return { push, subscribe, unsubscribe };
};

export default subscriptionController;

export type SubscriptionController = ReturnType<typeof subscriptionController>;
