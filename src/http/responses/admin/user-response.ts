import User from '@/db/models/system/user';

export default (user: User) => {
  return {
    ...user.get(),
    roles: user.roles?.map((role) => role.role),
  };
};
