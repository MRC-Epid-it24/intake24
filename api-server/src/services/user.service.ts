import { CreateUserRequest, UpdateUserRequest } from '@common/types/http';
import { User, UserPassword } from '@/db/models/system';
import { ForbiddenError, NotFoundError } from '@/http/errors';
import { defaultAlgorithm } from '@/util/passwords';
import { toSimpleName } from '@/util';

export type UserPasswordInput = {
  userId: number;
  password: string;
};

export interface UserService {
  create: (request: CreateUserRequest) => Promise<User>;
  update: (userId: string | number, request: UpdateUserRequest) => Promise<User>;
  destroy: (userId: string | number) => Promise<void>;
  createPassword: (userId: number, password: string) => Promise<UserPassword>;
  createPasswords: (records: UserPasswordInput[]) => Promise<UserPassword[]>;
  updatePassword: (userId: number, password: string) => Promise<UserPassword>;
}

export default (): UserService => {
  const createPassword = async (userId: number, password: string): Promise<UserPassword> => {
    const { salt, hash } = await defaultAlgorithm.hash(password);

    return UserPassword.create({
      userId,
      passwordSalt: salt,
      passwordHash: hash,
      passwordHasher: defaultAlgorithm.id,
    });
  };

  const createPasswords = async (passwordInput: UserPasswordInput[]): Promise<UserPassword[]> => {
    const records = [];

    for (const input of passwordInput) {
      const { userId, password } = input;
      const { salt, hash } = await defaultAlgorithm.hash(password);

      records.push({
        userId,
        passwordSalt: salt,
        passwordHash: hash,
        passwordHasher: defaultAlgorithm.id,
      });
    }

    return UserPassword.bulkCreate(records);
  };

  const updatePassword = async (userId: number, password: string): Promise<UserPassword> => {
    const userPassword = await UserPassword.findByPk(userId);
    if (!userPassword) throw new NotFoundError();

    const { salt, hash } = await defaultAlgorithm.hash(password);

    return userPassword.update({
      passwordSalt: salt,
      passwordHash: hash,
      passwordHasher: defaultAlgorithm.id,
    });
  };

  const create = async (request: CreateUserRequest): Promise<User> => {
    const { password, permissions, roles, ...rest } = request;

    const user = await User.create({ ...rest, simpleName: toSimpleName(rest.name) });

    await user.$set('permissions', permissions);
    await user.$set('roles', roles);
    await createPassword(user.id, password);

    return user;
  };

  const update = async (userId: string | number, request: UpdateUserRequest): Promise<User> => {
    const user = await User.findByPk(userId);

    if (!user) throw new NotFoundError();

    const { permissions, roles, ...rest } = request;

    await user.update({ ...rest, simpleName: toSimpleName(rest.name) });
    await user.$set('permissions', permissions);
    await user.$set('roles', roles);

    return user;
  };

  const destroy = async (userId: string | number): Promise<void> => {
    const user = await User.scope('submissions').findByPk(userId);

    if (!user) throw new NotFoundError();

    if (user.submissions?.length)
      throw new ForbiddenError('User cannot be deleted. It already contains submission data.');

    await user.destroy();
  };

  return {
    createPassword,
    createPasswords,
    updatePassword,
    create,
    update,
    destroy,
  };
};
