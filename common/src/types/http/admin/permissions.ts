import { Permission } from '../../models/system';
import { Pagination } from '../../models/pagination';
import { Dictionary } from '../../common';

export type PermissionRequest = {
  name: string;
  displayName: string;
  description: string | null;
};

export type PermissionsResponse = Pagination<Permission>;

export type PermissionEntry = Permission;

export type PermissionRefs = Dictionary;

export type PermissionResponse = {
  data: PermissionEntry;
  refs: PermissionRefs;
};

export type CreatePermissionResponse = Pick<PermissionResponse, 'refs'>;

export type StorePermissionResponse = Pick<PermissionResponse, 'data'>;
