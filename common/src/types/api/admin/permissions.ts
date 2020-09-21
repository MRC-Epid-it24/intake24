import { Permission } from '../../models/system';
import { Pagination } from '../../models/pagination';
import { AnyDictionary } from '../../common';

export type PermissionListResponse = Pagination<Permission>;

export type PermissionEntryResponse = {
  data: Permission;
  refs: AnyDictionary;
};

export type PermissionCreateResponse = Pick<PermissionEntryResponse, 'refs'>;

export type PermissionStoreResponse = Pick<PermissionEntryResponse, 'data'>;
