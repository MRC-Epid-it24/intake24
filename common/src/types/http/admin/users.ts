import { CustomField } from '../..';
import { UserAttributes, UserAssociations, Pagination } from '../../models';
import { PermissionListEntry } from './permissions';
import { RoleListEntry } from './roles';

export type UserInput = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  multiFactorAuthentication?: boolean;
  customFields?: CustomField[];
  permissions: string[];
  roles: string[];
};

export interface CreateUserInput extends UserInput {
  password: string;
}

export interface CreateUserRequest extends CreateUserInput {
  passwordConfirm: string;
}

export type UpdateUserInput = UserInput;

export type UpdateUserRequest = UpdateUserInput;

/*
 - for use of we want to allow updating password in Admin UI
export interface UpdateUserInput extends UserInput {
  password?: string;
}
export interface UpdateUserRequest extends UpdateUserInput {
  passwordConfirm?: string;
} */

export type UsersResponse = Pagination<UserAttributes>;

export type UserEntry = UserAttributes &
  Required<Pick<UserAssociations, 'aliases' | 'customFields' | 'permissions' | 'roles'>>;

export type UserListEntry = Pick<UserAttributes, 'id' | 'name' | 'email'>;

export type UserRefs = {
  permissions: PermissionListEntry[];
  roles: RoleListEntry[];
};

export type UserResponse = {
  data: UserEntry;
  refs: UserRefs;
};

export type CreateUserResponse = Pick<UserResponse, 'refs'>;

export type StoreUserResponse = Pick<UserResponse, 'data'>;
