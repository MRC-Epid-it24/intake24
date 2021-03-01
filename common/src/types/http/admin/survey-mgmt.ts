import type { PermissionListEntry, UserListEntry } from '.';
import type { Pagination } from '../../models';

export interface UserMgmtListEntry extends UserListEntry {
  permissions: PermissionListEntry[];
}

export type SurveysMgmtResponse = Pagination<UserMgmtListEntry>;

export type SurveysMgmtAvailableResponse = {
  users: UserListEntry[];
  permissions: PermissionListEntry[];
};
