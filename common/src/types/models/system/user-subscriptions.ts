import type { UserAttributes } from '.';

export type SubscriptionType = 'web-push';

export type PushSubscription = {
  endpoint: string;
  expirationTime?: number | Date | null; // TODO: Verify this
  keys: {
    p256dh: string;
    auth: string;
  };
};

export type UserSubscriptionAttributes = {
  id: string;
  userId: string;
  type: SubscriptionType;
  subscription: PushSubscription;
  createdAt: Date;
  updatedAt: Date;
};

export type UserSubscriptionCreationAttributes = Omit<
  UserSubscriptionAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export type UserSubscriptionAssociations = {
  user?: UserAttributes;
};
