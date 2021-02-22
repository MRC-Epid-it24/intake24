import { Op } from 'sequelize';
import { UserPassword as UserPasswordAttributes } from '@common/types/models';
import { CreateUserInput, UpdateUserInput } from '@common/types/http';
import { User, UserCustomField, UserPassword } from '@/db/models/system';
import { ForbiddenError, NotFoundError } from '@/http/errors';
import { defaultAlgorithm } from '@/util/passwords';
import { toSimpleName } from '@/util';

export type UserPasswordInput = {
  userId: number;
  password: string;
};

export interface UserService {
  create: (request: CreateUserInput) => Promise<User>;
  update: (userId: string | number, request: UpdateUserInput) => Promise<User>;
  destroy: (userId: string | number) => Promise<void>;
  createPassword: (userId: number, password: string) => Promise<UserPassword>;
  createPasswords: (records: UserPasswordInput[]) => Promise<UserPassword[]>;
  updatePassword: (userId: number, password: string) => Promise<UserPassword>;
}

export default (): UserService => {
  /**
   * Create password record
   *
   * @param {number} userId
   * @param {string} password
   * @returns {Promise<UserPassword>}
   */
  const createPassword = async (userId: number, password: string): Promise<UserPassword> => {
    const { salt, hash } = await defaultAlgorithm.hash(password);

    return UserPassword.create({
      userId,
      passwordSalt: salt,
      passwordHash: hash,
      passwordHasher: defaultAlgorithm.id,
    });
  };

  /**
   * Bulk-create password records
   *
   * @param {UserPasswordInput[]} passwordInput
   * @returns {Promise<UserPassword[]>}
   */
  const createPasswords = async (passwordInput: UserPasswordInput[]): Promise<UserPassword[]> => {
    const records: UserPasswordAttributes[] = [];

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

  /**
   * Update password
   *
   * @param {number} userId
   * @param {string} password
   * @returns {Promise<UserPassword>}
   */
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

  /**
   * Create new user & other associations. It creates:
   * - user record
   * - user password
   * - user custom fields
   * - user permissions
   * - user roles
   *
   * @param {CreateUserInput} request
   * @returns {Promise<User>}
   */
  const create = async (request: CreateUserInput): Promise<User> => {
    const { password, permissions, roles, ...rest } = request;

    const user = await User.create(
      { ...rest, simpleName: toSimpleName(rest.name) },
      { include: [UserCustomField] }
    );

    await createPassword(user.id, password);
    await user.$set('permissions', permissions);
    await user.$set('roles', roles);

    return user;
  };

  /**
   * Update existing user and its associations. It updates:
   * - user record
   * - user custom fields
   * - user permissions
   * - user roles
   *
   * @param {(string | number)} userId
   * @param {UpdateUserInput} request
   * @returns {Promise<User>}
   */
  const update = async (userId: string | number, request: UpdateUserInput): Promise<User> => {
    const user = await User.scope('customFields').findByPk(userId);

    if (!user) throw new NotFoundError();

    const { customFields, permissions, roles, ...rest } = request;

    await user.update({ ...rest, simpleName: toSimpleName(rest.name) });

    await user.$set('permissions', permissions);
    await user.$set('roles', roles);

    // Update custom fields
    if (customFields && user.customFields) {
      // 1) remove fields that are not present
      const customFieldNames = customFields.map((field) => field.name);
      await UserCustomField.destroy({ where: { userId, name: { [Op.notIn]: customFieldNames } } });

      for (const customField of customFields) {
        const { name, value } = customField;

        const matchIdx = user.customFields.findIndex((field) => field.name === name);

        // 2) add new field
        if (matchIdx === -1) {
          await UserCustomField.create({ ...customField, userId });
          continue;
        }

        // 3) update existing fields
        await user.customFields[matchIdx].update({ value });
      }
    }

    return user;
  };

  /**
   * Delete user record and its associations
   *
   * @param {(string | number)} userId
   * @returns {Promise<void>}
   */
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
