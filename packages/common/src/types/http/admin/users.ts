import { z } from 'zod';

import type {
  Pagination,
  PermissionAttributes,
  RoleAttributes,
  UserCustomFieldAttributes,
  UserSurveyAliasAttributes,
} from '@intake24/db';

import type { CustomField } from '../..';
import type { PermissionListEntry } from './permissions';
import type { RoleListEntry } from './roles';

export type UserInput = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  multiFactorAuthentication?: boolean;
  customFields?: CustomField[];
  permissions?: string[];
  roles?: string[];
  verifiedAt?: Date | null;
  disabledAt?: Date | null;
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

export const userAttributes = z.object({
  createdAt: z.date(),
  disabledAt: z.date().nullable(),
  email: z.string().nullable(),
  emailNotifications: z.boolean(),
  id: z.string(),
  multiFactorAuthentication: z.boolean(),
  name: z.string().nullable(),
  phone: z.string().nullable(),
  simpleName: z.string().nullable(),
  smsNotifications: z.boolean(),
  updatedAt: z.date(),
  verifiedAt: z.date().nullable(),
});

export type UserAttributes = z.infer<typeof userAttributes>;

export type UsersResponse = Pagination<UserAttributes>;

export type UserEntry = UserAttributes & {
  aliases: UserSurveyAliasAttributes[];
  customFields: UserCustomFieldAttributes[];
  permissions: PermissionAttributes[];
  roles: RoleAttributes[];
};

export type UserListEntry = Pick<UserAttributes, 'id' | 'name' | 'email'>;

export type Owner = Pick<UserAttributes, 'id' | 'name' | 'email'>;

export type UserRefs = {
  permissions: PermissionListEntry[];
  roles: RoleListEntry[];
};
