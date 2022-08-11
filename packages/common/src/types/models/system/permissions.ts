import type { OmitAndOptional } from '../../common';
import type { RoleAttributes, UserAttributes } from '.';

export type PermissionAttributes = {
  id: string;
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
  permissionId: string;
  roleId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PermissionRoleCreationAttributes = Omit<
  PermissionAttributes,
  'createdAt' | 'updatedAt'
>;

export type PermissionUserAttributes = {
  permissionId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PermissionUserCreationAttributes = Omit<
  PermissionUserAttributes,
  'createdAt' | 'updatedAt'
>;
