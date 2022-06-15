import type { SecurableType } from '../../../security';

export type UserSecurableAttributes = {
  userId: string;
  securableId: string;
  securableType: SecurableType;
  action: string;
  fields: string[] | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UserSecurableCreationAttributes = Omit<
  UserSecurableAttributes,
  'createdAt' | 'updatedAt'
>;
