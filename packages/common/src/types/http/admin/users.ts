import { isInt } from 'validator';
import { z } from 'zod';

import { strongPasswordWithConfirmOptional } from '@intake24/common/schemas';

import { customField } from '../..';
import { permissionAttributes } from './permissions';
import { roleAttributes } from './roles';

export const userRequest = z.object({
  disabledAt: z.coerce.date().nullish(),
  email: z.string().max(512).email().toLowerCase().nullish(),
  emailNotifications: z.boolean().optional(),
  multiFactorAuthentication: z.boolean().optional(),
  name: z.string().max(512).nullish(),
  phone: z.string().max(32).nullish(),
  smsNotifications: z.boolean().optional(),
  verifiedAt: z.coerce.date().nullish(),
  permissions: z.string().refine(value => isInt(value)).array().optional(),
  roles: z.string().refine(value => isInt(value)).array().optional(),
  customFields: customField.array().optional(),
}).merge(strongPasswordWithConfirmOptional);

export type UserRequest = z.infer<typeof userRequest>;

export const userInput = userRequest.omit({
  passwordConfirm: true,
});
export type UserInput = z.infer<typeof userInput>;

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

export const userCustomField = z.object({
  id: z.string(),
  name: z.string(),
  value: z.string(),
});

export const userSurveyAliasAttributes = z.object({
  id: z.string(),
  surveyId: z.string(),
  userId: z.string(),
  username: z.string().min(1).max(256),
  urlAuthToken: z.string().min(1).max(128),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserSurveyAliasAttributes = z.infer<typeof userSurveyAliasAttributes>;

export const userEntry = userAttributes.extend({
  aliases: z.any().array(),
  customFields: userCustomField.array(),
  permissions: permissionAttributes.array(),
  roles: roleAttributes.array(),
});

export type UserEntry = z.infer<typeof userEntry>;

export type UserListEntry = Pick<UserAttributes, 'id' | 'name' | 'email'>;

export type Owner = Pick<UserAttributes, 'id' | 'name' | 'email'>;

export const userRefs = z.object({
  permissions: permissionAttributes.pick({ name: true, displayName: true, description: true }).array(),
  roles: roleAttributes.pick({ name: true, displayName: true, description: true }).array(),
});
export type UserRefs = z.infer<typeof userRefs>;
