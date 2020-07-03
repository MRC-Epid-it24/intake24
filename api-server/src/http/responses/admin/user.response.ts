import { UserResponse } from '@common/types/api/admin/users';
import User from '@/db/models/system/user';

export default (user: User): UserResponse => {
  return {
    ...user.get(),
    roles: user.roles?.map((role) => role.role) ?? [],
  } as UserResponse;
};
