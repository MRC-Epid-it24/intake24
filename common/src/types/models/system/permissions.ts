import type { OmitAndOptional } from '..';
import type { RoleAttributes, UserAttributes } from '.';

export type PermissionAttributes = {
  id: number;
  name: string;
  displayName: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PermissionCreationAttributes = OmitAndOptional<
  PermissionAttributes,
  'id' | 'createdAt' | 'updatedAt',
  'description'
>;

export type PermissionAssociations = {
  roles?: RoleAttributes[];
  users?: UserAttributes[];
};

export type PermissionRoleAttributes = {
  permissionId: number;
  roleId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type PermissionRoleCreationAttributes = Omit<
  PermissionAttributes,
  'createdAt' | 'updatedAt'
>;

export type PermissionUserAttributes = {
  permissionId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type PermissionUserCreationAttributes = Omit<
  PermissionUserAttributes,
  'createdAt' | 'updatedAt'
>;
