import type { Pagination, PermissionAttributes } from '../../models';

export type PermissionRequest = {
  name: string;
  displayName: string;
  description: string | null;
};

export type PermissionsResponse = Pagination<PermissionAttributes>;

export type PermissionEntry = PermissionAttributes;

export type PermissionListEntry = Pick<PermissionAttributes, 'id' | 'name' | 'displayName'>;
