import type { Request } from 'express';
import type { Attributes, FindOptions } from 'sequelize';

import type { RequestIoC } from '@intake24/api/ioc';
import type { Dictionary } from '@intake24/common/types';
import type { HasVisibility, ModelStatic, Permission, Role, Securable } from '@intake24/db';
import { ForbiddenError, NotFoundError } from '@intake24/api/http/errors';
import { ACL_PERMISSIONS_KEY, ACL_ROLES_KEY } from '@intake24/common/security';
import { getRequestParamFromSecurable, getResourceFromSecurable } from '@intake24/common/util';
import { securableScope, User } from '@intake24/db';

export type CheckAccessOptions = {
  params: Dictionary;
  scope?: string | string[];
};

const aclService = ({
  aclConfig,
  cache,
  currentUser,
}: Pick<RequestIoC, 'aclConfig' | 'cache' | 'currentUser'>) => {
  const { enabled, expiresIn } = aclConfig.cache;
  const { id: userId } = currentUser;

  let cachedPermissions: Permission[] | null = null;
  let cachedRoles: Role[] | null = null;

  /**
   * Fetch user's permissions from database
   *
   * @returns {Promise<Permission[]>}
   */
  const fetchPermissions = async (): Promise<Permission[]> => {
    const user = await User.scope(['permissions', 'rolesPerms']).findByPk(userId);
    if (!user) return [];

    return user.allPermissions();
  };

  /**
   * Fetch user's roles from database
   *
   * @returns {Promise<Role[]>}
   */
  const fetchRoles = async (): Promise<Role[]> => {
    const user = await User.scope('roles').findByPk(userId);
    if (!user) return [];

    return user.allRoles();
  };

  /**
   * Get user's permissions
   * - tries to fetch cached data if available and enabled
   * - then fetches data from database
   *
   * @returns {Promise<Permission[]>}
   */
  const getPermissions = async (): Promise<Permission[]> => {
    if (!enabled) return fetchPermissions();

    if (cachedPermissions) return cachedPermissions;

    cachedPermissions = await cache.remember<Permission[]>(
      `${ACL_PERMISSIONS_KEY}:${userId}`,
      expiresIn,
      fetchPermissions
    );

    return cachedPermissions;
  };

  /**
   * Get user's roles
   * - tries to fetch cached data if available and enabled
   * - then fetches data from database
   *
   * @returns {Promise<Role[]>}
   */
  const getRoles = async (): Promise<Role[]> => {
    if (!enabled) return fetchRoles();

    if (cachedRoles) return cachedRoles;

    cachedRoles = await cache.remember<Role[]>(`${ACL_ROLES_KEY}:${userId}`, expiresIn, fetchRoles);

    return cachedRoles;
  };

  /**
   * Check is user has provided permission or each permission in provided list
   *
   * @param {(string | string[])} permission
   * @returns {Promise<boolean>}
   */
  const hasPermission = async (permission: string | string[]): Promise<boolean> => {
    const currentPermissions = await getPermissions();
    if (!currentPermissions.length) return false;

    if (Array.isArray(permission)) {
      const currentPermissionNames = currentPermissions.map(({ name }) => name);
      return permission.every((item) => currentPermissionNames.includes(item));
    }

    return !!currentPermissions.find(({ name }) => name === permission);
  };

  /**
   * Check is user has any permission in provided list
   *
   * @param {string[]} permissions
   * @returns {Promise<boolean>}
   */
  const hasAnyPermission = async (permissions: string[]): Promise<boolean> => {
    const currentPermissions = await getPermissions();
    if (!currentPermissions.length) return false;

    return currentPermissions.some((item) => permissions.includes(item.name));
  };

  /**
   * Check is user has provided role or each role in provided list
   *
   * @param {(string | string[])} role
   * @returns {Promise<boolean>}
   */
  const hasRole = async (role: string | string[]): Promise<boolean> => {
    const currentRoles = await getRoles();
    if (!currentRoles.length) return false;

    if (Array.isArray(role)) {
      const currentRoleNames = currentRoles.map(({ name }) => name);
      return role.every((name) => currentRoleNames.includes(name));
    }

    return !!currentRoles.find(({ name }) => name === role);
  };

  /**
   * Check is user has any role in provided list
   *
   * @param {string[]} roles
   * @returns {Promise<boolean>}
   */
  const hasAnyRole = async (roles: string[]): Promise<boolean> => {
    const currentRoles = await getRoles();
    if (!currentRoles.length) return false;

    return currentRoles.some((item) => roles.includes(item.name));
  };

  /**
   * Check is user can access record based on
   * - securable actions
   * - ownership
   *
   * @param {Securable} securable
   * @param {string} action
   * @returns {Promise<boolean>}
   */
  const hasSecurableAccess = async (securable: Securable, action: string): Promise<boolean> => {
    const isOwner = securable.ownerId === userId;
    const canAccess = !!securable.securables?.find(
      (sec) => sec.userId === userId && sec.action === action
    );

    return isOwner || canAccess;
  };

  /**
   * Check is user can access record based on
   * - resource permissions
   *
   * @param {string} securableType
   * @param {string} action
   * @returns {Promise<boolean>}
   */
  const hasResourceAccess = async (securableType: string, action: string): Promise<boolean> => {
    const resource = getResourceFromSecurable(securableType);

    return hasPermission(`${resource}|${action}`);
  };

  /**
   * Check if user has access to a record
   *
   * @template T
   * @param {Request} req
   * @param {ModelStatic<T>} securable
   * @param {string} action
   * @returns {Promise<void>}
   */
  const checkAccess = async <T extends Securable>(
    req: Request,
    securable: ModelStatic<T>,
    action: string
  ): Promise<void> => {
    const securableType = securable.name;

    if (await hasResourceAccess(securableType, action)) return;

    const paramId = getRequestParamFromSecurable(securableType);
    const { [paramId]: securableId } = req.params;

    const record = await securable.findByPk(securableId, securableScope(userId));
    if (!record) throw new NotFoundError();

    const canAccessRecord = await hasSecurableAccess(record, action);
    if (!canAccessRecord) throw new ForbiddenError();
  };

  /**
   * Helper for `getAndCheckRecordAccess` and `findAndCheckRecordAccess`
   *
   * @template T
   * @param {ModelStatic<T>} securable
   * @param {string} action
   * @param {(T | null)} record
   * @returns {Promise<T>}
   */
  const checkRecordAccess = async <T extends Securable>(
    securable: ModelStatic<T>,
    action: string,
    record: T | null
  ): Promise<T> => {
    if (await hasResourceAccess(securable.name, action)) {
      if (!record) throw new NotFoundError();

      return record;
    }

    if (!record || !(await hasSecurableAccess(record, action))) throw new ForbiddenError();

    return record;
  };

  /**
   * Route-based record access check
   *
   * @template T
   * @param {ModelStatic<T>} securable
   * @param {string} action
   * @param {CheckAccessOptions} options
   * @returns {Promise<T>}
   */
  const getAndCheckRecordAccess = async <T extends Securable>(
    securable: ModelStatic<T>,
    action: string,
    options: CheckAccessOptions
  ): Promise<T> => {
    const securableType = securable.name;
    const paramId = getRequestParamFromSecurable(securableType);
    const {
      params: { [paramId]: securableId },
      scope,
    } = options;

    const record = await securable.scope(scope).findByPk(securableId, securableScope(userId));

    return checkRecordAccess(securable, action, record);
  };

  const findAndCheckRecordAccess = async <T extends Securable>(
    securable: ModelStatic<T>,
    action: string,
    findOptions: FindOptions<Attributes<T>>
  ): Promise<T> => {
    const record = await securable.findOne({ ...findOptions, ...securableScope(userId) });

    return checkRecordAccess(securable, action, record);
  };

  /**
   * Find record and check visibility
   *
   * @template T
   * @param {ModelStatic<T>} securable
   * @param {string} action
   * @param {FindOptions<Attributes<T>>} findOptions
   * @returns {Promise<T>}
   */
  const findAndCheckVisibility = async <T extends HasVisibility>(
    securable: ModelStatic<T>,
    action: string,
    findOptions: FindOptions<Attributes<T>>
  ): Promise<T> => {
    const record = await securable.findOne({ ...findOptions, ...securableScope(userId) });

    if (await hasResourceAccess(securable.name, action)) {
      if (!record) throw new NotFoundError();

      return record;
    }

    if (!record || (record.visibility !== 'public' && !(await hasSecurableAccess(record, action))))
      throw new ForbiddenError();

    return record;
  };

  /**
   * Get user's list of resource-based access actions
   *
   * @param {string} resource
   * @returns {Promise<string[]>}
   */
  const getResourceAccessActions = async (resource: string): Promise<string[]> =>
    (await getPermissions())
      .filter((permission) => permission.name.startsWith(`${resource}|`))
      .map((permission) => {
        const { name } = permission;
        const [, action] = name.split('|');
        return action;
      });

  /**
   * Get user's list of securable-based access actions
   *
   * @param {Securable} record
   * @returns {Promise<string[]>}
   */
  const getSecurableAccessActions = async (record: Securable): Promise<string[]> =>
    record.securables?.map(({ action }) => action) ?? [];

  /**
   * Get user's combined list of resource-based & securable-based access actions
   *
   * @param {Securable} record
   * @param {string} resource
   * @returns {Promise<string[]>}
   */
  const getAccessActions = async (record: Securable, resource: string): Promise<string[]> => {
    const [resourceActions, securableActions] = await Promise.all([
      getResourceAccessActions(resource),
      getSecurableAccessActions(record),
    ]);

    return [...new Set([...resourceActions, ...securableActions])];
  };

  return {
    getPermissions,
    getRoles,
    hasPermission,
    hasAnyPermission,
    hasRole,
    hasAnyRole,
    checkAccess,
    getAndCheckRecordAccess,
    findAndCheckRecordAccess,
    findAndCheckVisibility,
    getResourceAccessActions,
    getSecurableAccessActions,
    getAccessActions,
  };
};

export default aclService;

export type ACLService = ReturnType<typeof aclService>;
