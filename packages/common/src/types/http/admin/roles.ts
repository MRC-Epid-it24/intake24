import type { Pagination, PermissionAttributes, RoleAttributes } from '@intake24/db';

import type { PermissionListEntry } from './permissions';

export type RoleRequest = {
  name: string;
  displayName: string;
  description: string | null;
  permissions: string[];
};

export type RolesResponse = Pagination<RoleAttributes>;

export type RoleEntry = RoleAttributes & { permissions: PermissionAttributes[] };

export type RoleListEntry = Pick<RoleAttributes, 'id' | 'name' | 'displayName'>;

export type RoleRefs = { permissions: PermissionListEntry[] };
