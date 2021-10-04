import Redis from 'ioredis';
import { defaultExport, defaultMeals, defaultQuestions } from '@common/schemes';
import { SchemeTypes } from '@common/types/models';
import config from '@api/config';
import {
  Locale as FoodsLocale,
  NutrientType as FoodsNutrientType,
  NutrientUnit as FoodsNutrientUnit,
} from '@api/db/models/foods';
import {
  Language,
  Locale as SystemLocale,
  NutrientType as SystemNutrientType,
  NutrientUnit as SystemNutrientUnit,
  Scheme,
  Survey,
  User,
  UserSurveyAlias,
  Permission,
  Role,
} from '@api/db/models/system';
import ioc from '@api/ioc';

export type MockData = {
  foods: {
    locale: FoodsLocale;
  };
  system: {
    language: Language;
    locale: SystemLocale;
    scheme: Scheme;
    survey: Survey;
    role: Role;
    admin: User;
    user: User;
    respondent: UserSurveyAlias;
  };
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
    { name: 'users-browse', displayName: 'Browse users' },
    { name: 'users-read', displayName: 'Read users' },
    { name: 'users-create', displayName: 'Create users' },
    { name: 'users-edit', displayName: 'Edit users' },
    { name: 'users-delete', displayName: 'Delete users' },
    { name: 'roles-browse', displayName: 'Browse roles' },
    { name: 'roles-read', displayName: 'Read roles' },
    { name: 'roles-create', displayName: 'Create roles' },
    { name: 'roles-edit', displayName: 'Edit roles' },
    { name: 'roles-delete', displayName: 'Delete roles' },
    { name: 'permissions-browse', displayName: 'Browse permissions' },
    { name: 'permissions-read', displayName: 'Read permissions' },
    { name: 'permissions-create', displayName: 'Create permissions' },
    { name: 'permissions-edit', displayName: 'Edit permissions' },
    { name: 'permissions-delete', displayName: 'Delete permissions' },
    { name: 'as-served-browse', displayName: 'Browse as server images' },
    { name: 'as-served-read', displayName: 'Read as server images' },
    { name: 'as-served-create', displayName: 'Create as server images' },
    { name: 'as-served-edit', displayName: 'Edit as server images' },
    { name: 'as-served-delete', displayName: 'Delete as server images' },
    { name: 'guide-images-browse', displayName: 'Browse guide images' },
    { name: 'guide-images-read', displayName: 'Read guide images' },
    { name: 'guide-images-create', displayName: 'Create guide images' },
    { name: 'guide-images-edit', displayName: 'Edit guide images' },
    { name: 'guide-images-delete', displayName: 'Delete guide images' },
    { name: 'image-maps-browse', displayName: 'Browse image maps' },
    { name: 'image-maps-read', displayName: 'Read image maps' },
    { name: 'image-maps-create', displayName: 'Create image maps' },
    { name: 'image-maps-edit', displayName: 'Edit image maps' },
    { name: 'image-maps-delete', displayName: 'Delete image maps' },
    { name: 'jobs-browse', displayName: 'Browse jobs' },
    { name: 'jobs-read', displayName: 'Read jobs' },
    { name: 'jobs-create', displayName: 'Create jobs' },
    { name: 'jobs-edit', displayName: 'Edit jobs' },
    { name: 'jobs-delete', displayName: 'Delete jobs' },
    { name: 'languages-browse', displayName: 'Browse languages' },
    { name: 'languages-read', displayName: 'Read languages' },
    { name: 'languages-create', displayName: 'Create languages' },
    { name: 'languages-edit', displayName: 'Edit languages' },
    { name: 'languages-delete', displayName: 'Delete languages' },
    { name: 'locales-browse', displayName: 'Browse locales' },
    { name: 'locales-read', displayName: 'Read locales' },
    { name: 'locales-create', displayName: 'Create locales' },
    { name: 'locales-edit', displayName: 'Edit locales' },
    { name: 'locales-delete', displayName: 'Delete locales' },
    { name: 'nutrient-tables-browse', displayName: 'Browse nutrient tables' },
    { name: 'nutrient-tables-read', displayName: 'Read nutrient tables' },
    { name: 'nutrient-tables-create', displayName: 'Create nutrient tables' },
    { name: 'nutrient-tables-edit', displayName: 'Edit nutrient tables' },
    { name: 'nutrient-tables-delete', displayName: 'Delete nutrient tables' },
    { name: 'nutrient-tables-upload', displayName: 'Nutrient tables upload' },
    { name: 'schemes-browse', displayName: 'Browse schemes' },
    { name: 'schemes-read', displayName: 'Read schemes' },
    { name: 'schemes-create', displayName: 'Create schemes' },
    { name: 'schemes-edit', displayName: 'Edit schemes' },
    { name: 'schemes-delete', displayName: 'Delete schemes' },
    { name: 'schemes-data-export', displayName: 'Scheme data export' },
    { name: 'schemes-questions', displayName: 'Scheme questions' },
    { name: 'scheme-questions-browse', displayName: 'Browse scheme questions' },
    { name: 'scheme-questions-read', displayName: 'Read scheme questions' },
    { name: 'scheme-questions-create', displayName: 'Create scheme questions' },
    { name: 'scheme-questions-edit', displayName: 'Edit scheme questions' },
    { name: 'scheme-questions-delete', displayName: 'Delete scheme questions' },
    { name: 'scheme-questions-sync', displayName: 'Sync scheme questions' },
    { name: 'sign-in-logs-browse', displayName: 'Browse sign-in logs' },
    { name: 'sign-in-logs-read', displayName: 'Read sign-in logs' },
    { name: 'sign-in-logs-delete', displayName: 'Delete sign-in logs' },
    { name: 'surveys-browse', displayName: 'Browse surveys' },
    { name: 'surveys-read', displayName: 'Read surveys' },
    { name: 'surveys-create', displayName: 'Create surveys' },
    { name: 'surveys-edit', displayName: 'Edit surveys' },
    { name: 'surveys-delete', displayName: 'Delete surveys' },
    { name: 'surveys-data-export', displayName: 'Survey data export' },
    { name: 'surveys-mgmt', displayName: 'Survey management' },
    { name: 'surveys-overrides', displayName: 'Survey scheme overrides' },
    { name: 'surveys-respondents', displayName: 'Survey respondents' },
    { name: 'surveys-submissions', displayName: 'Survey submissions' },
    { name: 'tasks-browse', displayName: 'Browse tasks' },
    { name: 'tasks-read', displayName: 'Read tasks' },
    { name: 'tasks-create', displayName: 'Create tasks' },
    { name: 'tasks-edit', displayName: 'Edit tasks' },
    { name: 'tasks-delete', displayName: 'Delete tasks' },
  ];

  const locales = await SystemLocale.findAll();
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

  const localeInput = {
    id: 'en_GB',
    englishName: 'United Kingdom',
    localName: 'United Kingdom',
    respondentLanguageId: language.id,
    adminLanguageId: language.id,
    countryFlagCode: 'gb',
    prototypeLocaleId: null,
    textDirection: 'ltr',
  };

  const foodsLocale = await FoodsLocale.create(localeInput);
  const systemLocale = await SystemLocale.create(localeInput);

  const nutrientUnits = [
    { id: '1', description: 'Gram', symbol: 'g' },
    { id: '2', description: 'Milligram', symbol: 'mg' },
    { id: '3', description: 'Microgram', symbol: 'µg' },
    { id: '4', description: 'Kilocalorie', symbol: 'kcal' },
    { id: '5', description: 'Kilojoule', symbol: 'kJ' },
    { id: '6', description: 'International Units', symbol: 'IU' },
  ];

  await FoodsNutrientUnit.bulkCreate(nutrientUnits);
  await SystemNutrientUnit.bulkCreate(nutrientUnits);

  const nutrientTypes = [
    { id: '1', description: 'Energy (kcal)', unitId: '4' },
    { id: '2', description: 'Energy (kJ)', unitId: '5' },
    {
      id: '3',
      description: 'Energy, total metabolisable (kcal, including dietary fibre)',
      unitId: '4',
    },
    {
      id: '4',
      description: 'Energy, total metabolisable, available carbohydrate, FSANZ (kcal)',
      unitId: '4',
    },
    {
      id: '5',
      description: 'Energy, total metabolisable, available carbohydrate, FSANZ (kJ)',
      unitId: '5',
    },
    {
      id: '6',
      description: 'Energy, total metabolisable, carbohydrate by difference, FSANZ (kcal) Units',
      unitId: '4',
    },
    {
      id: '7',
      description: 'Energy, total metabolisable, carbohydrate by difference, FSANZ (kJ)',
      unitId: '5',
    },
    { id: '8', description: 'Water', unitId: '1' },
    { id: '9', description: 'Total nitrogen', unitId: '1' },
    { id: '10', description: 'Nitrogen conversion factor', unitId: '1' },
  ];

  await FoodsNutrientType.bulkCreate(nutrientTypes);
  await SystemNutrientType.bulkCreate(nutrientTypes);

  const scheme = await Scheme.create({
    id: 'default',
    name: 'Default',
    type: SchemeTypes.DATA_DRIVEN,
    questions: defaultQuestions,
    meals: [...defaultMeals],
    export: defaultExport,
  });

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);

  const survey = await Survey.create({
    id: 'test-survey',
    name: 'Test Survey Name',
    state: 0,
    startDate,
    endDate,
    schemeId: scheme.id,
    localeId: systemLocale.id,
    allowGenUsers: false,
    supportEmail: 'testSupportEmail@example.com',
    storeUserSessionOnServer: false,
    overrides: { meals: [], questions: [] },
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

  return {
    foods: {
      locale: foodsLocale,
    },
    system: {
      language,
      locale: systemLocale,
      scheme,
      survey,
      role,
      admin,
      user,
      respondent,
    },
  };
};

export const cleanup = async (): Promise<void> => {
  for (const model of Object.values(ioc.cradle.db.foods.models)) {
    await model.truncate({ cascade: true });
  }

  for (const model of Object.values(ioc.cradle.db.system.models)) {
    await model.truncate({ cascade: true });
  }
};
