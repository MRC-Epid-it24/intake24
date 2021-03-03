import type { User } from '.';

export type SubscriptionType = 'web-push';

export type PushSubscription = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

export type UserSubscription = {
  id: number;
  userId: number;
  type: SubscriptionType;
  subscription: PushSubscription;
  createdAt: Date;
  updatedAt: Date;
};

export type UserSubscriptionAssociations = {
  user?: User;
};
