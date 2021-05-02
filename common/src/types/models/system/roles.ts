import type { OmitAndOptional } from '..';
import type { PermissionAttributes, UserAttributes } from '.';

export type RoleAttributes = {
  id: number;
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
  roleId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type RoleUserCreationAttributes = Omit<RoleUserAttributes, 'createdAt' | 'updatedAt'>;
