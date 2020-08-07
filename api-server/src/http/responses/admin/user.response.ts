import { UserResponse } from '@common/types/api/admin/users';
import User from '@/db/models/system/user';

export default (user: User): UserResponse => {
  return {
    ...user.get(),
    permissions: user.permissions,
    roles: user.roles,
  } as UserResponse;
};
