import { uniqBy } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type { CustomField } from '@intake24/common/types';
import type { CreateUserInput, UpdateUserInput } from '@intake24/common/types/http/admin';
import type { UserPasswordAttributes } from '@intake24/common/types/models';
import type { Transaction } from '@intake24/db';
import { ForbiddenError, NotFoundError } from '@intake24/api/http/errors';
import { toSimpleName } from '@intake24/api/util';
import { ACL_PERMISSIONS_KEY, ACL_ROLES_KEY, globalSupport } from '@intake24/common/security';
import { defaultAlgorithm } from '@intake24/common-backend/util/passwords';
import { Op, Permission, Role, RoleUser, User, UserCustomField, UserPassword } from '@intake24/db';

export type UserPasswordInput = {
  userId: string;
  password: string;
};

const adminUserService = ({ aclConfig, cache, db }: Pick<IoC, 'aclConfig' | 'cache' | 'db'>) => {
  /**
   * Flush ACL cache for specified user
   *
   * @param {string} userId
   * @returns {Promise<void>}
   */
  const flushUserACLCache = async (userId: string): Promise<void> => {
    const keys = [`${ACL_PERMISSIONS_KEY}:${userId}`, `${ACL_ROLES_KEY}:${userId}`];
    await cache.forget(keys);
  };

  /**
   * Flush ACL cache for specified role
   *
   * @param {string} roleId
   * @returns {Promise<void>}
   */
  const flushRoleACLCache = async (roleId: string): Promise<void> => {
    const roleUsers = await RoleUser.findAll({ where: { roleId } });

    await Promise.all(roleUsers.map(({ userId }) => flushUserACLCache(userId)));
  };

  /**
   * Create password record
   *
   * @param {UserPasswordInput} { userId, password }
   * @param {Transaction} [transaction]
   * @returns {Promise<UserPassword>}
   */
  const createPassword = async (
    { userId, password }: UserPasswordInput,
    transaction?: Transaction
  ): Promise<UserPassword> => {
    const { salt, hash } = await defaultAlgorithm.hash(password);

    return UserPassword.create(
      {
        userId,
        passwordSalt: salt,
        passwordHash: hash,
        passwordHasher: defaultAlgorithm.id,
      },
      { transaction }
    );
  };

  /**
   * Bulk-create password records
   *
   * @param {UserPasswordInput[]} inputs
   * @param {Transaction} [transaction]
   * @returns {Promise<UserPassword[]>}
   */
  const createPasswords = async (
    inputs: UserPasswordInput[],
    transaction?: Transaction
  ): Promise<UserPassword[]> => {
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

    return UserPassword.bulkCreate(records, { transaction });
  };

  /**
   * Update user custom fields
   * 1) it deletes non missing one
   * 2) updates existing ones
   * 3) add new ones
   *
   * @param {string} userId
   * @param {UserCustomField[]} userCustomFields
   * @param {CustomField[]} customFields
   * @param {Transaction} [transaction]
   * @returns {Promise<void>}
   */
  const updateUserCustomFields = async (
    userId: string,
    userCustomFields: UserCustomField[],
    customFields: CustomField[],
    transaction?: Transaction
  ): Promise<void> => {
    // 1) remove fields that are not present
    const customFieldNames = customFields.map((field) => field.name);
    await UserCustomField.destroy({
      where: { userId, name: { [Op.notIn]: customFieldNames } },
      transaction,
    });

    if (!customFields.length) return;

    for (const customField of customFields) {
      const { name, value } = customField;

      const matchIdx = userCustomFields.findIndex((field) => field.name === name);

      // 2) add new field
      if (matchIdx === -1) {
        await UserCustomField.create({ ...customField, userId }, { transaction });
        continue;
      }

      // 3) update existing fields
      await userCustomFields[matchIdx].update({ value }, { transaction });
    }
  };

  /**
   * Update user password
   *
   * @param {string} userId
   * @param {string} password
   * @param {Transaction} [transaction]
   * @returns {Promise<UserPassword>}
   */
  const updatePassword = async (
    userId: string,
    password: string,
    transaction?: Transaction
  ): Promise<UserPassword> => {
    const userPassword = await UserPassword.findByPk(userId);
    if (!userPassword) throw new NotFoundError();

    const { salt, hash } = await defaultAlgorithm.hash(password);

    return userPassword.update(
      {
        passwordSalt: salt,
        passwordHash: hash,
        passwordHasher: defaultAlgorithm.id,
      },
      { transaction }
    );
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
    const { password, permissions = [], roles = [], ...rest } = input;

    return db.system.transaction(async (transaction) => {
      const user = await User.create(
        { ...rest, simpleName: toSimpleName(rest.name) },
        { include: [UserCustomField], transaction }
      );

      await Promise.all([
        createPassword({ userId: user.id, password }, transaction),
        user.$set('permissions', permissions, { transaction }),
        user.$set('roles', roles, { transaction }),
      ]);

      return user;
    });
  };

  /**
   * Admin tool signup - create new user with researcher role
   *
   * @param {CreateUserInput} input
   * @returns {Promise<User>}
   */
  const signUp = async (input: CreateUserInput): Promise<User> => {
    const { enabled, permissions: permissionNames, roles: roleNames } = aclConfig.signup;
    if (!enabled) throw new ForbiddenError();

    const [permissionRecords, roleRecords] = await Promise.all([
      Permission.findAll({ attributes: ['id'], where: { name: permissionNames } }),
      Role.findAll({ attributes: ['id'], where: { name: roleNames } }),
    ]);

    const permissions = permissionRecords.map(({ id }) => id);
    const roles = roleRecords.map(({ id }) => id);

    return create({ ...input, permissions, roles });
  };

  /**
   * Update existing user and its associations. It updates:
   * - user record
   * - user custom fields
   * - user permissions
   * - user roles
   *
   * @param {string} userId
   * @param {UpdateUserInput} input
   * @returns {Promise<User>}
   */
  const update = async (userId: string, input: UpdateUserInput): Promise<User> => {
    const user = await User.scope('customFields').findByPk(userId);

    if (!user) throw new NotFoundError();

    const { customFields, permissions = [], roles = [], ...rest } = input;

    await db.system.transaction(async (transaction) => {
      await Promise.all([
        user.update({ ...rest, simpleName: toSimpleName(rest.name) }, { transaction }),
        user.$set('permissions', permissions, { transaction }),
        user.$set('roles', roles, { transaction }),
      ]);

      // Update custom fields
      if (customFields && user.customFields)
        await updateUserCustomFields(userId, user.customFields, customFields, transaction);

      await flushUserACLCache(user.id);
    });

    return user;
  };

  /**
   * Delete user record and its associations
   *
   * @param {string} userId
   * @returns {Promise<void>}
   */
  const destroy = async (userId: string): Promise<void> => {
    const user = await User.scope('submissions').findByPk(userId);
    if (!user) throw new NotFoundError();

    if (user.submissions?.length)
      throw new ForbiddenError('User cannot be deleted. It already contains submission data.');

    await user.destroy();
  };

  /**
   * Add permission(s) to user record by permission name(s)
   *
   * @param {(string | User)} userId
   * @param {(string | string[])} permissionName
   */
  const addPermissionByName = async (userId: string | User, permissionName: string | string[]) => {
    const user = typeof userId === 'string' ? await User.findByPk(userId) : userId;
    if (!user) throw new NotFoundError();

    const permission = await Permission.findOne({ where: { name: permissionName } });
    if (!permission) throw new NotFoundError();

    await Promise.all([user.$add('permissions', permission), flushUserACLCache(user.id)]);
  };

  /**
   * Remove permission(s) from user record by permission name(s)
   *
   * @param {(string | User)} userId
   * @param {(string | string[])} permissionName
   */
  const removePermissionByName = async (
    userId: string | User,
    permissionName: string | string[]
  ) => {
    const user = typeof userId === 'string' ? await User.findByPk(userId) : userId;
    if (!user) throw new NotFoundError();

    const permission = await Permission.findOne({ where: { name: permissionName } });
    if (!permission) throw new NotFoundError();

    await Promise.all([user.$remove('permissions', permission), flushUserACLCache(user.id)]);
  };

  /**
   * Fetch all user with survey support securable
   *
   * @param {string} surveyId
   * @returns {Promise<User[]>}
   */
  const getSurveySupportUsers = async (surveyId: string): Promise<User[]> =>
    User.findAll({
      where: { email: { [Op.ne]: null } },
      include: [
        {
          association: 'securables',
          where: { securableType: 'Survey', securableId: surveyId, action: 'support' },
          required: true,
        },
      ],
    });

  /**
   * Fetch all users with `globalSupport` permission
   *
   * @returns {Promise<User[]>}
   */
  const getGlobalSupportUsers = async (): Promise<User[]> => {
    const users = await Promise.all([
      User.findAll({
        where: { email: { [Op.ne]: null } },
        include: [
          {
            association: 'permissions',
            required: true,
            through: { attributes: [] },
            where: { name: globalSupport },
          },
        ],
      }),
      User.findAll({
        where: { email: { [Op.ne]: null } },
        include: [
          {
            association: 'roles',
            required: true,
            through: { attributes: [] },
            include: [
              {
                association: 'permissions',
                required: true,
                through: { attributes: [] },
                where: { name: globalSupport },
              },
            ],
          },
        ],
      }),
    ]);

    return uniqBy(users.flat(), 'id');
  };

  return {
    flushUserACLCache,
    flushRoleACLCache,
    createPassword,
    createPasswords,
    updateUserCustomFields,
    updatePassword,
    create,
    signUp,
    update,
    destroy,
    addPermissionByName,
    removePermissionByName,
    getSurveySupportUsers,
    getGlobalSupportUsers,
  };
};

export default adminUserService;

export type AdminUserService = ReturnType<typeof adminUserService>;
