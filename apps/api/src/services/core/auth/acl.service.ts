import { Permission, Role, Securable, User } from '@intake24/db';
import type { IoC } from '@intake24/api/ioc';
import { ACL_PERMISSIONS_KEY, ACL_ROLES_KEY } from '@intake24/common/acl';
import { securableToResource } from '@intake24/common/util';

const aclService = ({
  aclConfig,
  cache,
  currentUser,
}: Pick<IoC, 'aclConfig' | 'cache' | 'currentUser'>) => {
  const { enabled, expiresIn } = aclConfig.cache;
  const { id: userId } = currentUser;

  let cachedPermissions: Permission[] | null = null;
  let cachedRoles: Role[] | null = null;

  const fetchPermissions = async (): Promise<Permission[]> => {
    const user = await User.scope(['permissions', 'rolesPerms']).findByPk(userId);
    if (!user) return [];

    return user.allPermissions();
  };

  const fetchRoles = async (): Promise<Role[]> => {
    const user = await User.scope('roles').findByPk(userId);
    if (!user) return [];

    return user.allRoles();
  };

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

  const getRoles = async (): Promise<Role[]> => {
    if (!enabled) return fetchRoles();

    if (cachedRoles) return cachedRoles;

    cachedRoles = await cache.remember<Role[]>(`${ACL_ROLES_KEY}:${userId}`, expiresIn, fetchRoles);

    return cachedRoles;
  };

  const hasPermission = async (permission: string | string[]): Promise<boolean> => {
    const currentPermissions = await getPermissions();
    if (!currentPermissions.length) return false;

    if (Array.isArray(permission)) {
      const currentPermissionNames = currentPermissions.map(({ name }) => name);
      return permission.every((item) => currentPermissionNames.includes(item));
    }

    return !!currentPermissions.find(({ name }) => name === permission);
  };

  const hasAnyPermission = async (permissions: string[]): Promise<boolean> => {
    const currentPermissions = await getPermissions();
    if (!currentPermissions.length) return false;

    return currentPermissions.some((item) => permissions.includes(item.name));
  };

  const hasRole = async (role: string | string[]): Promise<boolean> => {
    const currentRoles = await getRoles();
    if (!currentRoles.length) return false;

    if (Array.isArray(role)) {
      const currentRoleNames = currentRoles.map(({ name }) => name);
      return role.every((name) => currentRoleNames.includes(name));
    }

    return !!currentRoles.find(({ name }) => name === role);
  };

  const hasAnyRole = async (roles: string[]): Promise<boolean> => {
    const currentRoles = await getRoles();
    if (!currentRoles.length) return false;

    return currentRoles.some((item) => roles.includes(item.name));
  };

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

  const getAccessActions = async (record: Securable, resource: string): Promise<string[]> => {
    const securableActions = record.securables?.map(({ action }) => action) ?? [];

    const permissionActions = (await getPermissions())
      .filter((permission) => permission.name.startsWith(`${resource}|`))
      .map((permission) => {
        const { name } = permission;
        const [, action] = name.split('|');
        return action;
      });

    return [...new Set([...securableActions, ...permissionActions])];
  };

  return {
    getPermissions,
    getRoles,
    hasPermission,
    hasAnyPermission,
    hasRole,
    hasAnyRole,
    canAccessRecord,
    getAccessActions,
  };
};

export default aclService;

export type ACLService = ReturnType<typeof aclService>;
