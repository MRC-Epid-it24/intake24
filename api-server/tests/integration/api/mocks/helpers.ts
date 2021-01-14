import { Locale, Permission, Role } from '@/db/models/system';

export const setPermission = async (perm: string | string[]): Promise<void> => {
  const role = await Role.findOne({ where: { name: 'test-role' } });

  if (!role) throw new Error('Missing mock role.');

  const name = Array.isArray(perm) ? perm : [perm];

  const permissions = await Permission.findAll({ where: { name } });

  if (name.length && name.length !== permissions.length)
    throw new Error('Missing mock permissions.');

  await role.$set('permissions', permissions);
};

export const setupPermissions = async (): Promise<void> => {
  const permissions = [
    { name: 'acl', display_name: 'Access Control List' },
    { name: 'globalsupport', display_name: 'Global Support' },
    { name: 'surveyadmin', display_name: 'Survey Admin' },
    { name: 'foodsadmin', display_name: 'Food DB Admin' },
    { name: 'users-list', display_name: 'List users' },
    { name: 'users-detail', display_name: 'Browse users' },
    { name: 'users-create', display_name: 'Create users' },
    { name: 'users-edit', display_name: 'Edit users' },
    { name: 'users-delete', display_name: 'Delete users' },
    { name: 'roles-list', display_name: 'List roles' },
    { name: 'roles-detail', display_name: 'Browse roles' },
    { name: 'roles-create', display_name: 'Create roles' },
    { name: 'roles-edit', display_name: 'Edit roles' },
    { name: 'roles-delete', display_name: 'Delete roles' },
    { name: 'permissions-list', display_name: 'List permissions' },
    { name: 'permissions-detail', display_name: 'Browse permissions' },
    { name: 'permissions-create', display_name: 'Create permissions' },
    { name: 'permissions-edit', display_name: 'Edit permissions' },
    { name: 'permissions-delete', display_name: 'Delete permissions' },
    { name: 'languages-list', display_name: 'List languages' },
    { name: 'languages-detail', display_name: 'Browse languages' },
    { name: 'languages-create', display_name: 'Create languages' },
    { name: 'languages-edit', display_name: 'Edit languages' },
    { name: 'languages-delete', display_name: 'Delete languages' },
    { name: 'locales-list', display_name: 'List locales' },
    { name: 'locales-detail', display_name: 'Browse locales' },
    { name: 'locales-create', display_name: 'Create locales' },
    { name: 'locales-edit', display_name: 'Edit locales' },
    { name: 'locales-delete', display_name: 'Delete locales' },
    { name: 'schemes-list', display_name: 'List schemes' },
    { name: 'schemes-detail', display_name: 'Browse schemes' },
    { name: 'schemes-create', display_name: 'Create schemes' },
    { name: 'schemes-edit', display_name: 'Edit schemes' },
    { name: 'schemes-delete', display_name: 'Delete schemes' },
    { name: 'schemes-questions', display_name: 'Scheme questions' },
    { name: 'surveys-list', display_name: 'List surveys' },
    { name: 'surveys-detail', display_name: 'Browse surveys' },
    { name: 'surveys-create', display_name: 'Create surveys' },
    { name: 'surveys-edit', display_name: 'Edit surveys' },
    { name: 'surveys-delete', display_name: 'Delete surveys' },
    { name: 'surveys-mgmt', display_name: 'Survey management' },
    { name: 'surveys-respondents', display_name: 'Survey respondents' },
    { name: 'surveys-submissions', display_name: 'Survey submissions' },
    { name: 'tasks-list', display_name: 'List tasks' },
    { name: 'tasks-detail', display_name: 'Browse tasks' },
    { name: 'tasks-create', display_name: 'Create tasks' },
    { name: 'tasks-edit', display_name: 'Edit tasks' },
    { name: 'tasks-delete', display_name: 'Delete tasks' },
  ];

  const locales = await Locale.findAll();
  locales.forEach((locale) => {
    permissions.push({ name: `fdbm/${locale.id}`, display_name: `fdbm/${locale.id}` });
  });

  await Permission.bulkCreate(permissions);
};
