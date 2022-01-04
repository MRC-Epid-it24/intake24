/* eslint-disable import/prefer-default-export */
import { RoleEntry } from '@common/types/http/admin';
import { Role } from '@intake24/db';

export const roleEntryResponse = (role: Role): RoleEntry => ({
  ...role.get(),
  permissions: role.permissions ?? [],
});
