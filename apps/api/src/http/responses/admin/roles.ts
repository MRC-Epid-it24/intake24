import type { RoleEntry } from '@intake24/common/types/http/admin';
import type { Role } from '@intake24/db';

export function roleEntryResponse(role: Role): RoleEntry {
  return {
    ...role.get(),
    permissions: role.permissions ?? [],
  };
}
