/* eslint-disable import/prefer-default-export */
import { PermissionListEntry } from '@common/types/http';
import { Permission } from '@/db/models/system';

export const permissionListResponse = (permission: Permission): PermissionListEntry => {
  const { id, name, displayName } = permission;
  return { id, name, displayName };
};
