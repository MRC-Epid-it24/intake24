import { Request, Response } from 'express';
import { User, UserSubscription } from '@/db/models/system';
import type { IoC } from '@/ioc';
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
    const { id } = req.user as User;
    const { subscription } = req.body;

    await UserSubscription.create({ userId: id, type: 'web-push', subscription });

    res.status(201).json();
  };

  const unsubscribe = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.user as User;

    await UserSubscription.destroy({ where: { userId: id, type: 'web-push' } });

    res.status(204).json();
  };

  return { push, subscribe, unsubscribe };
};
