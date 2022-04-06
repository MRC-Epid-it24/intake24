import Redis from 'ioredis';
import { defaultExport, defaultMeals, defaultQuestions } from '@intake24/common/schemes';
import {
  FeedbackScheme,
  FoodsLocale,
  FoodsNutrientType,
  FoodsNutrientUnit,
  Language,
  SystemLocale,
  SystemNutrientType,
  SystemNutrientUnit,
  SurveyScheme,
  Survey,
  User,
  UserSurveyAlias,
  Permission,
  Role,
} from '@intake24/db';
import ioc from '@intake24/api/ioc';
import { defaultTopFoods } from '@intake24/common/feedback';

export type MockData = {
  foods: {
    locale: FoodsLocale;
  };
  system: {
    language: Language;
    locale: SystemLocale;
    feedbackScheme: FeedbackScheme;
    surveyScheme: SurveyScheme;
    survey: Survey;
    role: Role;
    admin: User;
    user: User;
    respondent: UserSurveyAlias;
  };
};

export const wipeRedis = async (): Promise<void> => {
  const { host, port } = ioc.cradle.config.queue.redis;
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
    { name: 'users', displayName: 'Users resource access' },
    { name: 'users|browse', displayName: 'Browse users' },
    { name: 'users|read', displayName: 'Read users' },
    { name: 'users|create', displayName: 'Create users' },
    { name: 'users|edit', displayName: 'Edit users' },
    { name: 'users|delete', displayName: 'Delete users' },
    { name: 'roles', displayName: 'Roles resource access' },
    { name: 'roles|browse', displayName: 'Browse roles' },
    { name: 'roles|read', displayName: 'Read roles' },
    { name: 'roles|create', displayName: 'Create roles' },
    { name: 'roles|edit', displayName: 'Edit roles' },
    { name: 'roles|delete', displayName: 'Delete roles' },
    { name: 'permissions', displayName: 'Permissions resource access' },
    { name: 'permissions|browse', displayName: 'Browse permissions' },
    { name: 'permissions|read', displayName: 'Read permissions' },
    { name: 'permissions|create', displayName: 'Create permissions' },
    { name: 'permissions|edit', displayName: 'Edit permissions' },
    { name: 'permissions|delete', displayName: 'Delete permissions' },
    { name: 'as-served', displayName: 'As served images resource access' },
    { name: 'as-served|browse', displayName: 'Browse as served images' },
    { name: 'as-served|read', displayName: 'Read as served images' },
    { name: 'as-served|create', displayName: 'Create as served images' },
    { name: 'as-served|edit', displayName: 'Edit as served images' },
    { name: 'as-served|delete', displayName: 'Delete as served images' },
    { name: 'fdbs', displayName: 'Food databases resource access' },
    { name: 'fdbs|browse', displayName: 'Browse food databases' },
    { name: 'fdbs|read', displayName: 'Read food databases' },
    { name: 'fdbs|create', displayName: 'Create food databases' },
    { name: 'fdbs|edit', displayName: 'Edit food databases' },
    { name: 'fdbs|delete', displayName: 'Delete food databases' },
    { name: 'feedback-schemes', displayName: 'Feedback schemes resource access' },
    { name: 'feedback-schemes|browse', displayName: 'Browse feedback schemes' },
    { name: 'feedback-schemes|read', displayName: 'Read feedback schemes' },
    { name: 'feedback-schemes|create', displayName: 'Create feedback schemes' },
    { name: 'feedback-schemes|edit', displayName: 'Edit feedback schemes' },
    { name: 'feedback-schemes|delete', displayName: 'Delete feedback schemes' },
    { name: 'feedback-schemes|cards', displayName: 'Feedback scheme cards' },
    { name: 'feedback-schemes|top-foods', displayName: 'Feedback scheme top foods' },
    { name: 'feedback-schemes|copy', displayName: 'Copy feedback schemes' },
    { name: 'feedback-schemes|security', displayName: 'Feedback schemes security' },
    { name: 'food-groups', displayName: 'Food groups resource access' },
    { name: 'food-groups|browse', displayName: 'Browse food groups' },
    { name: 'food-groups|read', displayName: 'Read food groups' },
    { name: 'food-groups|create', displayName: 'Create food groups' },
    { name: 'food-groups|edit', displayName: 'Edit food groups' },
    { name: 'food-groups|delete', displayName: 'Delete food groups' },
    { name: 'guide-images', displayName: 'Guide images resource access' },
    { name: 'guide-images|browse', displayName: 'Browse guide images' },
    { name: 'guide-images|read', displayName: 'Read guide images' },
    { name: 'guide-images|create', displayName: 'Create guide images' },
    { name: 'guide-images|edit', displayName: 'Edit guide images' },
    { name: 'guide-images|delete', displayName: 'Delete guide images' },
    { name: 'image-maps', displayName: 'Image maps resource access' },
    { name: 'image-maps|browse', displayName: 'Browse image maps' },
    { name: 'image-maps|read', displayName: 'Read image maps' },
    { name: 'image-maps|create', displayName: 'Create image maps' },
    { name: 'image-maps|edit', displayName: 'Edit image maps' },
    { name: 'image-maps|delete', displayName: 'Delete image maps' },
    { name: 'jobs', displayName: 'Jobs resource access' },
    { name: 'jobs|browse', displayName: 'Browse jobs' },
    { name: 'jobs|read', displayName: 'Read jobs' },
    { name: 'jobs|create', displayName: 'Create jobs' },
    { name: 'jobs|edit', displayName: 'Edit jobs' },
    { name: 'jobs|delete', displayName: 'Delete jobs' },
    { name: 'languages', displayName: 'Languages resource access' },
    { name: 'languages|browse', displayName: 'Browse languages' },
    { name: 'languages|read', displayName: 'Read languages' },
    { name: 'languages|create', displayName: 'Create languages' },
    { name: 'languages|edit', displayName: 'Edit languages' },
    { name: 'languages|delete', displayName: 'Delete languages' },
    { name: 'locales', displayName: 'Locales resource access' },
    { name: 'locales|browse', displayName: 'Browse locales' },
    { name: 'locales|read', displayName: 'Read locales' },
    { name: 'locales|create', displayName: 'Create locales' },
    { name: 'locales|edit', displayName: 'Edit locales' },
    { name: 'locales|delete', displayName: 'Delete locales' },
    { name: 'nutrient-tables', displayName: 'Nutrient tables resource access' },
    { name: 'nutrient-tables|browse', displayName: 'Browse nutrient tables' },
    { name: 'nutrient-tables|read', displayName: 'Read nutrient tables' },
    { name: 'nutrient-tables|create', displayName: 'Create nutrient tables' },
    { name: 'nutrient-tables|edit', displayName: 'Edit nutrient tables' },
    { name: 'nutrient-tables|delete', displayName: 'Delete nutrient tables' },
    { name: 'nutrient-tables|upload', displayName: 'Nutrient tables upload' },
    { name: 'sign-in-logs', displayName: 'Sign-in logs resource access' },
    { name: 'sign-in-logs|browse', displayName: 'Browse sign-in logs' },
    { name: 'sign-in-logs|read', displayName: 'Read sign-in logs' },
    { name: 'sign-in-logs|delete', displayName: 'Delete sign-in logs' },
    { name: 'survey-schemes', displayName: 'Survey schemes resource access' },
    { name: 'survey-schemes|browse', displayName: 'Browse survey schemes' },
    { name: 'survey-schemes|read', displayName: 'Read survey schemes' },
    { name: 'survey-schemes|create', displayName: 'Create survey schemes' },
    { name: 'survey-schemes|edit', displayName: 'Edit survey schemes' },
    { name: 'survey-schemes|delete', displayName: 'Delete survey schemes' },
    { name: 'survey-schemes|data-export', displayName: 'Survey scheme data export' },
    { name: 'survey-schemes|questions', displayName: 'Survey scheme questions' },
    { name: 'survey-schemes|copy', displayName: 'Copy survey schemes' },
    { name: 'survey-schemes|security', displayName: 'Survey schemes security' },
    { name: 'survey-scheme-questions', displayName: 'Survey scheme questions resource access' },
    { name: 'survey-scheme-questions|browse', displayName: 'Browse survey scheme questions' },
    { name: 'survey-scheme-questions|read', displayName: 'Read survey scheme questions' },
    { name: 'survey-scheme-questions|create', displayName: 'Create survey scheme questions' },
    { name: 'survey-scheme-questions|edit', displayName: 'Edit survey scheme questions' },
    { name: 'survey-scheme-questions|delete', displayName: 'Delete survey scheme questions' },
    { name: 'survey-scheme-questions|sync', displayName: 'Sync survey scheme questions' },
    { name: 'surveys', displayName: 'Surveys resource access' },
    { name: 'surveys|browse', displayName: 'Browse surveys' },
    { name: 'surveys|read', displayName: 'Read surveys' },
    { name: 'surveys|create', displayName: 'Create surveys' },
    { name: 'surveys|edit', displayName: 'Edit surveys' },
    { name: 'surveys|delete', displayName: 'Delete surveys' },
    { name: 'surveys|data-export', displayName: 'Survey data export' },
    { name: 'surveys|mgmt', displayName: 'Survey management' },
    { name: 'surveys|overrides', displayName: 'Survey scheme overrides' },
    { name: 'surveys|respondents', displayName: 'Survey respondents' },
    { name: 'surveys|submissions', displayName: 'Survey submissions' },
    { name: 'tasks', displayName: 'Tasks resource access' },
    { name: 'tasks|browse', displayName: 'Browse tasks' },
    { name: 'tasks|read', displayName: 'Read tasks' },
    { name: 'tasks|create', displayName: 'Create tasks' },
    { name: 'tasks|edit', displayName: 'Edit tasks' },
    { name: 'tasks|delete', displayName: 'Delete tasks' },
  ];

  await Permission.bulkCreate(permissions);
};

export const initDatabase = async (): Promise<MockData> => {
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

  const [foodsLocale, systemLocale] = await Promise.all([
    FoodsLocale.create(localeInput),
    SystemLocale.create(localeInput),
  ]);

  const nutrientUnits = [
    { id: '1', description: 'Gram', symbol: 'g' },
    { id: '2', description: 'Milligram', symbol: 'mg' },
    { id: '3', description: 'Microgram', symbol: 'µg' },
    { id: '4', description: 'Kilocalorie', symbol: 'kcal' },
    { id: '5', description: 'Kilojoule', symbol: 'kJ' },
    { id: '6', description: 'International Units', symbol: 'IU' },
  ];

  await Promise.all([
    FoodsNutrientUnit.bulkCreate(nutrientUnits),
    SystemNutrientUnit.bulkCreate(nutrientUnits),
  ]);

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

  await Promise.all([
    FoodsNutrientType.bulkCreate(nutrientTypes),
    SystemNutrientType.bulkCreate(nutrientTypes),
  ]);

  const [feedbackScheme, surveyScheme] = await Promise.all([
    FeedbackScheme.create({
      name: 'Default',
      type: 'default',
      topFoods: { ...defaultTopFoods },
      cards: [],
      demographicGroups: [],
      henryCoefficients: [],
    }),
    SurveyScheme.create({
      name: 'Default',
      type: 'default',
      questions: defaultQuestions,
      meals: [...defaultMeals],
      dataExport: defaultExport,
    }),
  ]);

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);

  const survey = await Survey.create({
    id: 'test-survey',
    name: 'Test Survey Name',
    state: 0,
    startDate,
    endDate,
    feedbackSchemeId: feedbackScheme.id,
    surveySchemeId: surveyScheme.id,
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

  const admin = await ioc.cradle.adminUserService.create({
    email: 'testAdmin@example.com',
    password: 'testAdminPassword',
    permissions: [],
    roles: [adminRole.id],
  });

  const role = await Role.create({ name: 'test-role', displayName: 'Test Role' });

  const user = await ioc.cradle.adminUserService.create({
    email: 'testUser@example.com',
    password: 'testUserPassword',
    permissions: [],
    roles: [role.id],
  });

  const respondent = await ioc.cradle.adminSurveyService.createRespondent('test-survey', {
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
      feedbackScheme,
      surveyScheme,
      survey,
      role,
      admin,
      user,
      respondent,
    },
  };
};

export const wipeDatabase = async (): Promise<void> => {
  for (const model of Object.values(ioc.cradle.db.foods.models)) {
    await model.truncate({ cascade: true });
  }

  for (const model of Object.values(ioc.cradle.db.system.models)) {
    await model.truncate({ cascade: true });
  }
};
