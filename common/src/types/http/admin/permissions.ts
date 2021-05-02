import { Dictionary } from '../..';
import { PermissionAttributes, Pagination } from '../../models';

export type PermissionRequest = {
  name: string;
  displayName: string;
  description: string | null;
};

export type PermissionsResponse = Pagination<PermissionAttributes>;

export type PermissionEntry = PermissionAttributes;

export type PermissionListEntry = Pick<PermissionAttributes, 'id' | 'name' | 'displayName'>;

export type PermissionRefs = Dictionary;

export type PermissionResponse = {
  data: PermissionEntry;
  refs: PermissionRefs;
};

export type CreatePermissionResponse = Pick<PermissionResponse, 'refs'>;

export type StorePermissionResponse = Pick<PermissionResponse, 'data'>;
