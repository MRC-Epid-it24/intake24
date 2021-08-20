import type { OmitAndOptional } from '..';
import type { PermissionAttributes, RoleAttributes, UserSurveyAliasAttributes } from '.';

export type UserAttributes = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  simpleName: string | null;
  emailNotifications: boolean;
  smsNotifications: boolean;
  multiFactorAuthentication: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UserCreationAttributes = OmitAndOptional<
  UserAttributes,
  'id' | 'createdAt' | 'updatedAt',
  | 'name'
  | 'email'
  | 'phone'
  | 'simpleName'
  | 'emailNotifications'
  | 'smsNotifications'
  | 'multiFactorAuthentication'
>;

export type UserCustomFieldAttributes = {
  id: string;
  userId: string;
  name: string;
  value: string;
};

export type UserCustomFieldCreationAttributes = Omit<UserCustomFieldAttributes, 'id'>;

export type UserAssociations = {
  aliases?: UserSurveyAliasAttributes[];
  customFields?: UserCustomFieldAttributes[];
  permissions?: PermissionAttributes[];
  roles?: RoleAttributes[];
};
