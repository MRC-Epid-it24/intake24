import { isWhitelisted } from 'validator';
import { z } from 'zod';

import { identifierSafeChars } from '@intake24/common/rules';

export const permissionAttributes = z.object({
  id: z.string(),
  name: z.string().min(1).max(128).refine(value => isWhitelisted(value, `${identifierSafeChars}|`)),
  displayName: z.string().min(1).max(128),
  description: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PermissionAttributes = z.infer<typeof permissionAttributes>;

export const permissionRequest = permissionAttributes.pick({ name: true, displayName: true, description: true });
export type PermissionRequest = z.infer<typeof permissionRequest>;

export type PermissionEntry = PermissionAttributes;
export type PermissionListEntry = Pick<PermissionAttributes, 'id' | 'name' | 'displayName'>;
