import { UserEntry } from '@common/types/http/admin/users';
import { User } from '@/db/models/system';

export default (user: User): UserEntry => {
  return {
    ...user.get(),
    permissions: user.permissions,
    roles: user.roles,
  } as UserEntry;
};
