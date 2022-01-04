import { Permission, Role, User } from '@intake24/db';
import type { IoC } from '@api/ioc';

export const ACL_PERMISSIONS_KEY = 'acl:permissions';
export const ACL_ROLES_KEY = 'acl:roles';

export const respondentSuffix = '/respondent';
export const staffSuffix = '/staff';
export const supportSuffix = '/support';
export const foodDatabaseMaintainerPrefix = 'fdbm/';

export const globalsupport = 'globalsupport';
export const surveyAdmin = 'surveyadmin';
export const foodsAdmin = 'foodsadmin';

export const surveyStaff = (surveyId: string): string => `${surveyId}${staffSuffix}`;

export const surveySupport = (surveyId: string): string => `${surveyId}${supportSuffix}`;

export const surveyMgmt = (surveyId: string): string[] => [
  surveyStaff(surveyId),
  surveySupport(surveyId),
];

export const surveyRespondent = (surveyId: string): string => `${surveyId}${respondentSuffix}`;

export const surveyPermissions = (surveyId: string): string[] => [
  surveyRespondent(surveyId),
  surveyStaff(surveyId),
  surveySupport(surveyId),
];

export const foodDatabaseMaintainer = (localeId: string): string =>
  `${foodDatabaseMaintainerPrefix}${localeId}`;

export const foodDatabasePermissions = (localeId: string): string[] => [
  foodDatabaseMaintainer(localeId),
];

const aclService = ({
  aclConfig,
  cache,
  currentUser,
}: Pick<IoC, 'aclConfig' | 'cache' | 'currentUser'>) => {
  const { enabled, expiresIn } = aclConfig.cache;
  const { id: userId } = currentUser;

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

    return cache.remember<Permission[]>(
      `${ACL_PERMISSIONS_KEY}:${userId}`,
      expiresIn,
      fetchPermissions
    );
  };

  const getRoles = async (): Promise<Role[]> => {
    if (!enabled) return fetchRoles();

    return cache.remember<Role[]>(`${ACL_ROLES_KEY}:${userId}`, expiresIn, fetchRoles);
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

  return {
    getPermissions,
    getRoles,
    hasPermission,
    hasAnyPermission,
    hasRole,
    hasAnyRole,
  };
};

export default aclService;

export type ACLService = ReturnType<typeof aclService>;
