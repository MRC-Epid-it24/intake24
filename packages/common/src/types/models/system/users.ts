import type { OmitAndOptional } from '../../common';
import type {
  ClientErrorReportAttributes,
  JobAttributes,
  PermissionAttributes,
  RefreshTokenAttributes,
  RoleAttributes,
  SignInLogAttributes,
  SurveySubmissionAttributes,
  UserPasswordAttributes,
  UserPasswordResetAttributes,
  UserPhysicalDataAttributes,
  UserSubscriptionAttributes,
  UserSurveyAliasAttributes,
  UserSurveySessionAttributes,
} from '.';

export type UserAttributes = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  simpleName: string | null;
  emailNotifications: boolean;
  smsNotifications: boolean;
  multiFactorAuthentication: boolean;
  verifiedAt: Date | null;
  disabledAt: Date | null;
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
  | 'verifiedAt'
  | 'disabledAt'
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
  clientErrors?: ClientErrorReportAttributes[];
  customFields?: UserCustomFieldAttributes[];
  jobs?: JobAttributes[];
  password?: UserPasswordAttributes;
  passwordResets?: UserPasswordResetAttributes[];
  permissions?: PermissionAttributes[];
  physicalData?: UserPhysicalDataAttributes;
  roles?: RoleAttributes[];
  sessions?: UserSurveySessionAttributes[];
  signInLog?: SignInLogAttributes[];
  submissions?: SurveySubmissionAttributes[];
  subscription?: UserSubscriptionAttributes[];
  tokens?: RefreshTokenAttributes[];
};
