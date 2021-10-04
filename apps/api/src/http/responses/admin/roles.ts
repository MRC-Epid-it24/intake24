/* eslint-disable import/prefer-default-export */
import { RoleEntry } from '@common/types/http/admin';
import { Role } from '@api/db/models/system';

export const roleEntryResponse = (role: Role): RoleEntry => ({
  ...role.get(),
  permissions: role.permissions ?? [],
});
