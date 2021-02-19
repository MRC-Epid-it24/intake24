import { Locale, Permission, Role, User } from '@/db/models/system';

/**
 * Set permissions for a testing role
 *
 * @param {(string | string[])} perm
 * @returns {Promise<void>}
 */
export const setPermission = async (
  perm: string | string[],
  roleName = 'test-role'
): Promise<void> => {
  const role = await Role.findOne({ where: { name: roleName } });

  if (!role) throw new Error('Missing mock role.');

  const name = Array.isArray(perm) ? perm : [perm];

  const permissions = await Permission.findAll({ where: { name } });

  if (name.length && name.length !== permissions.length)
    throw new Error('Missing mock permissions.');

  await role.$set('permissions', permissions);
};

/**
 * Set permissions for a testing user
 *
 * @param {(string | string[])} perm
 * @param {number} userId
 * @returns {Promise<void>}
 */
export const setUserPermission = async (perm: string | string[], userId: number): Promise<void> => {
  const user = await User.findByPk(userId);

  if (!user) throw new Error('Missing mock user.');

  const name = Array.isArray(perm) ? perm : [perm];

  const permissions = await Permission.findAll({ where: { name } });

  if (name.length && name.length !== permissions.length)
    throw new Error('Missing mock permissions.');

  await user.$set('permissions', permissions);
};

/**
 * Fill database with all available permissions
 *
 * @returns {Promise<void>}
 */
export const setupPermissions = async (): Promise<void> => {
  const permissions = [
    { name: 'acl', displayName: 'Access Control List' },
    { name: 'globalsupport', displayName: 'Global Support' },
    { name: 'surveyadmin', displayName: 'Survey Admin' },
    { name: 'foodsadmin', displayName: 'Food DB Admin' },
    { name: 'users-list', displayName: 'List users' },
    { name: 'users-detail', displayName: 'Browse users' },
    { name: 'users-create', displayName: 'Create users' },
    { name: 'users-edit', displayName: 'Edit users' },
    { name: 'users-delete', displayName: 'Delete users' },
    { name: 'roles-list', displayName: 'List roles' },
    { name: 'roles-detail', displayName: 'Browse roles' },
    { name: 'roles-create', displayName: 'Create roles' },
    { name: 'roles-edit', displayName: 'Edit roles' },
    { name: 'roles-delete', displayName: 'Delete roles' },
    { name: 'permissions-list', displayName: 'List permissions' },
    { name: 'permissions-detail', displayName: 'Browse permissions' },
    { name: 'permissions-create', displayName: 'Create permissions' },
    { name: 'permissions-edit', displayName: 'Edit permissions' },
    { name: 'permissions-delete', displayName: 'Delete permissions' },
    { name: 'languages-list', displayName: 'List languages' },
    { name: 'languages-detail', displayName: 'Browse languages' },
    { name: 'languages-create', displayName: 'Create languages' },
    { name: 'languages-edit', displayName: 'Edit languages' },
    { name: 'languages-delete', displayName: 'Delete languages' },
    { name: 'locales-list', displayName: 'List locales' },
    { name: 'locales-detail', displayName: 'Browse locales' },
    { name: 'locales-create', displayName: 'Create locales' },
    { name: 'locales-edit', displayName: 'Edit locales' },
    { name: 'locales-delete', displayName: 'Delete locales' },
    { name: 'schemes-list', displayName: 'List schemes' },
    { name: 'schemes-detail', displayName: 'Browse schemes' },
    { name: 'schemes-create', displayName: 'Create schemes' },
    { name: 'schemes-edit', displayName: 'Edit schemes' },
    { name: 'schemes-delete', displayName: 'Delete schemes' },
    { name: 'schemes-data-export', displayName: 'Scheme data export' },
    { name: 'schemes-questions', displayName: 'Scheme questions' },
    { name: 'surveys-list', displayName: 'List surveys' },
    { name: 'surveys-detail', displayName: 'Browse surveys' },
    { name: 'surveys-create', displayName: 'Create surveys' },
    { name: 'surveys-edit', displayName: 'Edit surveys' },
    { name: 'surveys-delete', displayName: 'Delete surveys' },
    { name: 'surveys-data-export', displayName: 'Survey data export' },
    { name: 'surveys-mgmt', displayName: 'Survey management' },
    { name: 'surveys-respondents', displayName: 'Survey respondents' },
    { name: 'surveys-submissions', displayName: 'Survey submissions' },
    { name: 'tasks-list', displayName: 'List tasks' },
    { name: 'tasks-detail', displayName: 'Browse tasks' },
    { name: 'tasks-create', displayName: 'Create tasks' },
    { name: 'tasks-edit', displayName: 'Edit tasks' },
    { name: 'tasks-delete', displayName: 'Delete tasks' },
  ];

  const locales = await Locale.findAll();
  locales.forEach((locale) => {
    permissions.push({ name: `fdbm/${locale.id}`, displayName: `fdbm/${locale.id}` });
  });

  await Permission.bulkCreate(permissions);
};
