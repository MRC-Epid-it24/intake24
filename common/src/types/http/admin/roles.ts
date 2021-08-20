import { RoleAttributes, RoleAssociations, Pagination } from '../../models';
import { PermissionEntry } from './permissions';

export type RoleRequest = {
  name: string;
  displayName: string;
  description: string | null;
  permissions: string[];
};

export type RolesResponse = Pagination<RoleAttributes>;

export type RoleEntry = RoleAttributes & Required<Pick<RoleAssociations, 'permissions'>>;

export type RoleListEntry = Pick<RoleAttributes, 'id' | 'name' | 'displayName'>;

export type RoleRefs = { permissions: PermissionEntry[] };

export type RoleResponse = {
  data: RoleEntry;
  refs: RoleRefs;
};

export type CreateRoleResponse = Pick<RoleResponse, 'refs'>;

export type StoreRoleResponse = Pick<RoleResponse, 'data'>;
