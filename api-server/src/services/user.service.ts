import { Op } from 'sequelize';
import { UserPassword as UserPasswordAttributes } from '@common/types/models';
import { CreateUserInput, UpdateUserInput } from '@common/types/http';
import { User, UserCustomField, UserPassword } from '@/db/models/system';
import { ForbiddenError, NotFoundError } from '@/http/errors';
import { defaultAlgorithm } from '@/util/passwords';
import { toSimpleName } from '@/util';
import { CustomField } from '@common/types';

export type UserPasswordInput = {
  userId: number;
  password: string;
};

export interface UserService {
  create: (input: CreateUserInput) => Promise<User>;
  update: (userId: number | string, input: UpdateUserInput) => Promise<User>;
  destroy: (userId: number | string) => Promise<void>;
  updateUserCustomFields: (
    userId: number | string,
    userCustomFields: UserCustomField[],
    customFields: CustomField[]
  ) => Promise<void>;
  createPassword: (input: UserPasswordInput) => Promise<UserPassword>;
  createPasswords: (records: UserPasswordInput[]) => Promise<UserPassword[]>;
  updatePassword: (input: UserPasswordInput) => Promise<UserPassword>;
}

export default (): UserService => {
  /**
   * Create password record
   *
   * @param {UserPasswordInput} input
   * @returns {Promise<UserPassword>}
   */
  const createPassword = async ({ userId, password }: UserPasswordInput): Promise<UserPassword> => {
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
   * @param {UserPasswordInput[]} inputs
   * @returns {Promise<UserPassword[]>}
   */
  const createPasswords = async (inputs: UserPasswordInput[]): Promise<UserPassword[]> => {
    const records: UserPasswordAttributes[] = [];

    for (const input of inputs) {
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
   * Update user custom fields
   * 1) it deletes non missing one
   * 2) updates existing ones
   * 3) add new ones
   *
   * @param {(number | string)} userId
   * @param {UserCustomField[]} userCustomFields
   * @param {CustomField[]} customFields
   * @returns {Promise<void>}
   */
  const updateUserCustomFields = async (
    userId: number | string,
    userCustomFields: UserCustomField[],
    customFields: CustomField[]
  ): Promise<void> => {
    // 1) remove fields that are not present
    const customFieldNames = customFields.map((field) => field.name);
    await UserCustomField.destroy({ where: { userId, name: { [Op.notIn]: customFieldNames } } });

    if (!customFieldNames.length) return;

    for (const customField of customFields) {
      const { name, value } = customField;

      const matchIdx = userCustomFields.findIndex((field) => field.name === name);

      // 2) add new field
      if (matchIdx === -1) {
        await UserCustomField.create({ ...customField, userId });
        continue;
      }

      // 3) update existing fields
      await userCustomFields[matchIdx].update({ value });
    }
  };

  /**
   * Update password
   *
   * @param {UserPasswordInput} input
   * @returns {Promise<UserPassword>}
   */
  const updatePassword = async ({ userId, password }: UserPasswordInput): Promise<UserPassword> => {
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
   * @param {CreateUserInput} input
   * @returns {Promise<User>}
   */
  const create = async (input: CreateUserInput): Promise<User> => {
    const { password, permissions, roles, ...rest } = input;

    const user = await User.create(
      { ...rest, simpleName: toSimpleName(rest.name) },
      { include: [UserCustomField] }
    );

    await createPassword({ userId: user.id, password });
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
   * @param {UpdateUserInput} input
   * @returns {Promise<User>}
   */
  const update = async (userId: number | string, input: UpdateUserInput): Promise<User> => {
    const user = await User.scope('customFields').findByPk(userId);

    if (!user) throw new NotFoundError();

    const { customFields, permissions, roles, ...rest } = input;

    await user.update({ ...rest, simpleName: toSimpleName(rest.name) });

    await user.$set('permissions', permissions);
    await user.$set('roles', roles);

    // Update custom fields
    if (customFields && user.customFields)
      await updateUserCustomFields(userId, user.customFields, customFields);

    return user;
  };

  /**
   * Delete user record and its associations
   *
   * @param {(string | number)} userId
   * @returns {Promise<void>}
   */
  const destroy = async (userId: number | string): Promise<void> => {
    const user = await User.scope('submissions').findByPk(userId);

    if (!user) throw new NotFoundError();

    if (user.submissions?.length)
      throw new ForbiddenError('User cannot be deleted. It already contains submission data.');

    await user.destroy();
  };

  return {
    createPassword,
    createPasswords,
    updateUserCustomFields,
    updatePassword,
    create,
    update,
    destroy,
  };
};
