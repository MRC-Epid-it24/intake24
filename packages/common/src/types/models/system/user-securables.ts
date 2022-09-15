import type { SecurableType } from '../../../security';
import type { OmitAndOptional } from '../../common';

export type UserSecurableAttributes = {
  userId: string;
  securableId: string;
  securableType: SecurableType;
  action: string;
  fields: string[] | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UserSecurableCreationAttributes = OmitAndOptional<
  UserSecurableAttributes,
  'createdAt' | 'updatedAt',
  'fields'
>;
