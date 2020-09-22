import { Permission, Role } from '../../models/system';
import { Pagination } from '../../models/pagination';

export type RoleRequest = {
  name: string;
  displayName: string;
  description: string | null;
  permissions: number[];
};

export type RoleListResponse = Pagination<Role>;

export type RoleEntryResponse = {
  data: Role;
  refs: {
    permissions: Permission[];
  };
};

export type RoleCreateResponse = Pick<RoleEntryResponse, 'refs'>;

export type RoleStoreResponse = Pick<RoleEntryResponse, 'data'>;
