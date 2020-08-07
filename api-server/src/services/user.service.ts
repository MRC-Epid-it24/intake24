import slugify from 'slugify';
import { CreateUserRequest, UpdateUserRequest } from '@common/types/api/admin/users';
import { User, UserPassword } from '@/db/models/system';
import { ForbiddenError, NotFoundError } from '@/http/errors';
import { defaultAlgorithm } from '@/util/passwords';

export const toSimpleName = (name?: string | null): string | null =>
  name ? slugify(name, { replacement: ' ', lower: true }) : null;

export default {
  async create(request: CreateUserRequest): Promise<User> {
    const { password, roles, ...rest } = request;

    const user = await User.create({ ...rest, simpleName: toSimpleName(rest.name) });

    await user.$set('roles', roles);
    await this.createPassword(user.id, password);

    return user;
  },

  async update(userId: string | number, request: UpdateUserRequest): Promise<User> {
    const user = await User.scope('roles').findByPk(userId);

    if (!user) throw new NotFoundError();

    const { roles, ...rest } = request;

    await user.update({ ...rest, simpleName: toSimpleName(rest.name) });
    await user.$set('roles', roles);

    return user;
  },

  async delete(userId: string | number): Promise<void> {
    const user = await User.scope('submissions').findByPk(userId);

    if (!user) throw new NotFoundError();

    if (user.submissions?.length)
      throw new ForbiddenError('User cannot be deleted. It already contains submission data.');

    await user.destroy();
  },

  async createPassword(userId: number, password: string): Promise<UserPassword> {
    const { salt, hash } = await defaultAlgorithm.hash(password);

    return UserPassword.create({
      userId,
      passwordSalt: salt,
      passwordHash: hash,
      passwordHasher: defaultAlgorithm.id,
    });
  },

  async updatePassword(userId: number, password: string): Promise<UserPassword> {
    const userPassword = await UserPassword.findByPk(userId);
    if (!userPassword) throw new NotFoundError();

    const { salt, hash } = await defaultAlgorithm.hash(password);

    return userPassword.update({
      passwordSalt: salt,
      passwordHash: hash,
      passwordHasher: defaultAlgorithm.id,
    });
  },
};
