import type { Permission, Role, Securable } from '@intake24/db';
import { User } from '@intake24/db';
import type { RequestIoC } from '@intake24/api/ioc';
import { ACL_PERMISSIONS_KEY, ACL_ROLES_KEY } from '@intake24/common/security';
import { securableToResource } from '@intake24/common/util';

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
   * - resource permissions
   * - securable actions
   * - ownership
   *
   * @param {Securable} record
   * @param {string} action
   * @returns {Promise<boolean>}
   */
  const canAccessRecord = async (record: Securable, action: string): Promise<boolean> => {
    const resource = securableToResource(record.constructor.name);

    const checkPermission = await hasPermission(`${resource}|${action}`);
    if (checkPermission) return true;

    const isOwner = record.ownerId === userId;
    const canAccess = !!record.securables?.find(
      (sec) => sec.userId === userId && sec.action === action
    );

    return isOwner || canAccess;
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
    canAccessRecord,
    getResourceAccessActions,
    getSecurableAccessActions,
    getAccessActions,
  };
};

export default aclService;

export type ACLService = ReturnType<typeof aclService>;
