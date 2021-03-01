import { Permission, Role, Pagination } from '../../models';

export type RoleRequest = {
  name: string;
  displayName: string;
  description: string | null;
  permissions: number[];
};

export type RolesResponse = Pagination<Role>;

export type RoleEntry = Role;

export type RoleListEntry = Pick<Permission, 'id' | 'name' | 'displayName'>;

export type RoleRefs = { permissions: Permission[] };

export type RoleResponse = {
  data: RoleEntry;
  refs: RoleRefs;
};

export type CreateRoleResponse = Pick<RoleResponse, 'refs'>;

export type StoreRoleResponse = Pick<RoleResponse, 'data'>;
