/* eslint-disable import/prefer-default-export */
import type { PermissionListEntry } from '@intake24/common/types/http/admin';
import type { Permission } from '@intake24/db';

export const permissionListResponse = (permission: Permission): PermissionListEntry => {
  const { id, name, displayName } = permission;
  return { id, name, displayName };
};
