import { Redis } from 'ioredis';

import type { User, UserSurveyAlias } from '@intake24/db';
import ioc from '@intake24/api/ioc';
import {
  defaultMeals as defaultFeedbackMeals,
  defaultTopFoods as defaultFeedbackTopFoods,
  feedbackOutputs as defaultFeedbackOutputs,
  feedbackPhysicalDataFields,
  feedbackSections as defaultFeedbackSections,
} from '@intake24/common/feedback';
import { defaultExport, defaultMeals, defaultPrompts } from '@intake24/common/surveys';
import { permissions } from '@intake24/common-backend';
import {
  FeedbackScheme,
  FoodIndexBackend,
  FoodsLocale,
  FoodsNutrientType,
  FoodsNutrientUnit,
  Language,
  Permission,
  Role,
  StandardUnit,
  Survey,
  SurveyScheme,
  SystemLocale,
  SystemNutrientType,
  SystemNutrientUnit,
} from '@intake24/db';

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
  const redis = new Redis(ioc.cradle.config.queue.redis);
  await redis.flushall();
  redis.disconnect();
};

/**
 * Fill database with all available permissions
 *
 * @returns {Promise<void>}
 */
export const setupPermissions = async (): Promise<void> => {
  await Permission.bulkCreate(permissions);
};

export const initDatabase = async (): Promise<MockData> => {
  await FoodIndexBackend.create({ id: 'en', flag: 'gb', description: 'English' });

  const language = await Language.create({
    code: 'en',
    englishName: 'United Kingdom',
    localName: 'United Kingdom',
    countryFlagCode: 'gb',
    textDirection: 'ltr',
  });

  const localeInput = {
    englishName: 'United Kingdom',
    localName: 'United Kingdom',
    respondentLanguageId: language.code,
    adminLanguageId: language.code,
    countryFlagCode: 'gb',
    prototypeLocaleId: null,
    textDirection: 'ltr',
    foodIndexLanguageBackendId: 'en',
  };

  const [foodsLocale, systemLocale] = await Promise.all([
    FoodsLocale.create({ id: 'en_GB', ...localeInput }),
    SystemLocale.create({ code: 'en_GB', ...localeInput }),
  ]);

  const nutrientUnits = [
    { id: '1', description: 'Gram', symbol: 'g' },
    { id: '2', description: 'Milligram', symbol: 'mg' },
    { id: '3', description: 'Microgram', symbol: 'µg' },
    { id: '4', description: 'Kilocalorie', symbol: 'kcal' },
    { id: '5', description: 'Kilojoule', symbol: 'kJ' },
    { id: '6', description: 'International Units', symbol: 'IU' },
  ];

  const standardUnits = [
    { id: 'bags', name: 'Bags', estimateIn: { en: 'bags' }, howMany: { en: 'How many bags' } },
    { id: 'bars', name: 'Bars', estimateIn: { en: 'bars' }, howMany: { en: 'How many bars' } },
  ];

  await Promise.all([
    FoodsNutrientUnit.bulkCreate(nutrientUnits),
    SystemNutrientUnit.bulkCreate(nutrientUnits),
    StandardUnit.bulkCreate(standardUnits),
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
      outputs: [...defaultFeedbackOutputs],
      physicalDataFields: [...feedbackPhysicalDataFields],
      sections: [...defaultFeedbackSections],
      topFoods: { ...defaultFeedbackTopFoods },
      meals: { ...defaultFeedbackMeals },
      cards: [],
      demographicGroups: [],
      henryCoefficients: [],
    }),
    SurveyScheme.create({
      name: 'Default',
      type: 'default',
      prompts: defaultPrompts,
      meals: [...defaultMeals],
      dataExport: defaultExport,
    }),
  ]);

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);

  const survey = await Survey.create({
    slug: 'test-survey',
    name: 'Test Survey Name',
    state: 'notStarted',
    startDate,
    endDate,
    feedbackSchemeId: feedbackScheme.id,
    surveySchemeId: surveyScheme.id,
    localeId: systemLocale.id,
    allowGenUsers: false,
    supportEmail: 'testSupportEmail@example.com',
    storeUserSessionOnServer: false,
    surveySchemeOverrides: { meals: [], prompts: [] },
  });

  await setupPermissions();

  const adminRole = await Role.create({ name: 'admin-role', displayName: 'Admin Role' });
  const permissions = await Permission.findAll();
  await adminRole.$set('permissions', permissions);

  const admin = await ioc.cradle.adminUserService.create({
    email: 'testAdmin@example.com',
    password: 'testAdminPassword',
    verifiedAt: new Date(),
    permissions: [],
    roles: [adminRole.id],
  });

  const role = await Role.create({ name: 'test-role', displayName: 'Test Role' });

  const user = await ioc.cradle.adminUserService.create({
    email: 'testUser@example.com',
    password: 'testUserPassword',
    verifiedAt: new Date(),
    permissions: [],
    roles: [role.id],
  });

  const respondent = await ioc.cradle.adminSurveyService.createRespondent(survey, {
    username: 'testRespondent',
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
