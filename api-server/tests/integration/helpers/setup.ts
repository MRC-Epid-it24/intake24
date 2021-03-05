import Redis from 'ioredis';
import config from '@/config';
import {
  Language,
  Locale,
  Scheme,
  Survey,
  User,
  UserSurveyAlias,
  Permission,
  Role,
} from '@/db/models/system';
import ioc from '@/ioc';
import { defaultExport, defaultMeals, defaultQuestions } from '@common/defaults';

export type MockData = {
  language: Language;
  locale: Locale;
  scheme: Scheme;
  survey: Survey;
  role: Role;
  admin: User;
  user: User;
  respondent: UserSurveyAlias;
};

export const wipeRedis = async (): Promise<void> => {
  const { host, port } = config.queue.redis;
  const redis = new Redis(port, host);
  await redis.flushall();
  redis.disconnect();
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
    { name: 'users-browse', displayName: 'List users' },
    { name: 'users-detail', displayName: 'Browse users' },
    { name: 'users-create', displayName: 'Create users' },
    { name: 'users-edit', displayName: 'Edit users' },
    { name: 'users-delete', displayName: 'Delete users' },
    { name: 'roles-browse', displayName: 'List roles' },
    { name: 'roles-detail', displayName: 'Browse roles' },
    { name: 'roles-create', displayName: 'Create roles' },
    { name: 'roles-edit', displayName: 'Edit roles' },
    { name: 'roles-delete', displayName: 'Delete roles' },
    { name: 'permissions-browse', displayName: 'List permissions' },
    { name: 'permissions-detail', displayName: 'Browse permissions' },
    { name: 'permissions-create', displayName: 'Create permissions' },
    { name: 'permissions-edit', displayName: 'Edit permissions' },
    { name: 'permissions-delete', displayName: 'Delete permissions' },
    { name: 'languages-browse', displayName: 'List languages' },
    { name: 'languages-detail', displayName: 'Browse languages' },
    { name: 'languages-create', displayName: 'Create languages' },
    { name: 'languages-edit', displayName: 'Edit languages' },
    { name: 'languages-delete', displayName: 'Delete languages' },
    { name: 'locales-browse', displayName: 'List locales' },
    { name: 'locales-detail', displayName: 'Browse locales' },
    { name: 'locales-create', displayName: 'Create locales' },
    { name: 'locales-edit', displayName: 'Edit locales' },
    { name: 'locales-delete', displayName: 'Delete locales' },
    { name: 'schemes-browse', displayName: 'List schemes' },
    { name: 'schemes-detail', displayName: 'Browse schemes' },
    { name: 'schemes-create', displayName: 'Create schemes' },
    { name: 'schemes-edit', displayName: 'Edit schemes' },
    { name: 'schemes-delete', displayName: 'Delete schemes' },
    { name: 'schemes-data-export', displayName: 'Scheme data export' },
    { name: 'schemes-questions', displayName: 'Scheme questions' },
    { name: 'surveys-browse', displayName: 'List surveys' },
    { name: 'surveys-detail', displayName: 'Browse surveys' },
    { name: 'surveys-create', displayName: 'Create surveys' },
    { name: 'surveys-edit', displayName: 'Edit surveys' },
    { name: 'surveys-delete', displayName: 'Delete surveys' },
    { name: 'surveys-data-export', displayName: 'Survey data export' },
    { name: 'surveys-mgmt', displayName: 'Survey management' },
    { name: 'surveys-respondents', displayName: 'Survey respondents' },
    { name: 'surveys-submissions', displayName: 'Survey submissions' },
    { name: 'tasks-browse', displayName: 'List tasks' },
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

export const initDatabaseData = async (): Promise<MockData> => {
  const language = await Language.create({
    id: 'en',
    englishName: 'United Kingdom',
    localName: 'United Kingdom',
    countryFlagCode: 'gb',
    textDirection: 'ltr',
  });

  const locale = await Locale.create({
    id: 'en_GB',
    englishName: 'United Kingdom',
    localName: 'United Kingdom',
    respondentLanguageId: language.id,
    adminLanguageId: language.id,
    countryFlagCode: 'gb',
    prototypeLocaleId: null,
    textDirection: 'ltr',
  });

  const scheme = await Scheme.create({
    id: 'default',
    name: 'Default',
    type: 'data-driven',
    questions: defaultQuestions,
    meals: [...defaultMeals],
    export: defaultExport,
  });

  const today = new Date();

  const survey = await Survey.create({
    id: 'test-survey',
    state: 0,
    startDate: today,
    endDate: new Date().setDate(today.getDate() + 7),
    schemeId: scheme.id,
    localeId: locale.id,
    allowGenUsers: false,
    supportEmail: 'testSupportEmail@example.com',
    storeUserSessionOnServer: false,
  });

  await setupPermissions();

  const adminRole = await Role.create({ name: 'admin-role', displayName: 'Admin Role' });
  const permissions = await Permission.findAll();
  await adminRole.$set('permissions', permissions);

  const admin = await ioc.cradle.userService.create({
    email: 'testAdmin@example.com',
    password: 'testAdminPassword',
    permissions: [],
    roles: [adminRole.id],
  });

  const role = await Role.create({ name: 'test-role', displayName: 'Test Role' });

  const user = await ioc.cradle.userService.create({
    email: 'testUser@example.com',
    password: 'testUserPassword',
    permissions: [],
    roles: [role.id],
  });

  const respondent = await ioc.cradle.surveyService.createRespondent('test-survey', {
    userName: 'testRespondent',
    password: 'testRespondentPassword',
  });

  return { language, locale, scheme, survey, role, admin, user, respondent };
};

export const cleanup = async (): Promise<void> => {
  for (const model of Object.values(ioc.cradle.db.system.models)) {
    await model.truncate({ cascade: true });
  }
};
