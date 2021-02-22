import type { Permission, Role } from '.';

export type User = {
  id: number;
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

export type UserCustomField = {
  id: number;
  userId: number;
  name: string;
  value: string;
};

export type UserAssociations = {
  customFields?: UserCustomField[];
  permissions?: Permission[];
  roles?: Role[];
};
