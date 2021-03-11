import type { PermissionListEntry, UserListEntry } from '.';
import type { Pagination } from '../../models';

export interface UserMgmtListEntry extends UserListEntry {
  permissions: PermissionListEntry[];
}

export type SurveyMgmtResponse = Pagination<UserMgmtListEntry>;

export type SurveyMgmtAvailableResponse = {
  users: UserListEntry[];
  permissions: PermissionListEntry[];
};
