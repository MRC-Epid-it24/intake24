import type { OmitAndOptional } from '..';
import type { PermissionAttributes, UserAttributes } from '.';

export type RoleAttributes = {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type RoleCreationAttributes = OmitAndOptional<
  RoleAttributes,
  'id' | 'createdAt' | 'updatedAt',
  'description'
>;

export type RoleAssociations = {
  permissions?: PermissionAttributes[];
  users?: UserAttributes[];
};

export type RoleUserAttributes = {
  roleId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type RoleUserCreationAttributes = Omit<RoleUserAttributes, 'createdAt' | 'updatedAt'>;
