import { Permission, Role, User } from '@/db/models/system';
import type { IoC } from '@/ioc';

export const ACL_PERMISSIONS_KEY = 'acl:permissions';
export const ACL_ROLES_KEY = 'acl:roles';

export const respondentSuffix = '/respondent';
export const staffSuffix = '/staff';
export const supportSuffix = '/support';
export const foodDatabaseMaintainerPrefix = 'fdbm/';

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

export const foodDatabaseMaintainer = (fdbId: string): string =>
  `${foodDatabaseMaintainerPrefix}${fdbId}`;

export interface ACLService {
  getPermissions: () => Promise<Permission[]>;
  getRoles: () => Promise<Role[]>;
  hasPermission: (permission: string) => Promise<boolean>;
  hasAnyPermission: (permission: string[]) => Promise<boolean>;
  hasRole: (role: string) => Promise<boolean>;
  hasAnyRole: (role: string[]) => Promise<boolean>;
}

export default ({ cache, currentUser }: Pick<IoC, 'cache' | 'currentUser'>): ACLService => {
  const expiresIn = '7d';

  const getPermissions = async (): Promise<Permission[]> => {
    return cache.remember<Permission[]>(
      `${ACL_PERMISSIONS_KEY}:${currentUser.id}`,
      expiresIn,
      async () => {
        const user = await User.scope(['permissions', 'rolesPerms']).findByPk(currentUser.id);
        if (!user) return [];

        return user.allPermissions();
      }
    );
  };

  const getRoles = async (): Promise<Role[]> => {
    return cache.remember<Role[]>(`${ACL_ROLES_KEY}:${currentUser.id}`, expiresIn, async () => {
      const user = await User.scope('roles').findByPk(currentUser.id);
      if (!user) return [];

      return user.allRoles();
    });
  };

  const hasPermission = async (permission: string): Promise<boolean> => {
    const currentPermissions = await getPermissions();

    const match = currentPermissions.find((item) => item.name === permission);
    return !!match;
  };

  const hasAnyPermission = async (permissions: string[]): Promise<boolean> => {
    const currentPermissions = await getPermissions();

    return currentPermissions.some((item) => permissions.includes(item.name));
  };

  const hasRole = async (role: string): Promise<boolean> => {
    const currentRoles = await getRoles();

    const match = currentRoles.find((item) => item.name === role);
    return !!match;
  };

  const hasAnyRole = async (roles: string[]): Promise<boolean> => {
    const currentRoles = await getRoles();

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
