import { isInt, isWhitelisted } from 'validator';
import { z } from 'zod';

import { identifierSafeChars } from '@intake24/common/rules';

import { permissionAttributes } from './permissions';

export const roleAttributes = z.object({
  id: z.string(),
  name: z.string().min(1).max(128).refine(value => isWhitelisted(value, identifierSafeChars)),
  displayName: z.string().min(1).max(128),
  description: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type RoleAttributes = z.infer<typeof roleAttributes>;

export const roleRequest = roleAttributes.pick({ name: true, displayName: true, description: true }).extend({
  permissions: z.string().refine(value => isInt(value)).array(),
});
export type RoleRequest = z.infer<typeof roleRequest>;

export const roleEntry = roleAttributes.extend({
  permissions: permissionAttributes.array(),
});
export type RoleEntry = z.infer<typeof roleEntry>;

export const roleRefs = z.object({
  permissions: permissionAttributes.pick({ name: true, displayName: true, description: true }).array(),
});
export type RoleRefs = z.infer<typeof roleRefs>;
