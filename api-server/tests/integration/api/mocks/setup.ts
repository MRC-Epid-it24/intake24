import { Language, Locale, Scheme, Survey, User, UserSurveyAlias, Role } from '@/db/models/system';
import ioc from '@/ioc';
import { defaultMeals } from '@/db/models/system/scheme';
import { setupPermissions } from './helpers';

export type MockData = {
  language: Language;
  locale: Locale;
  scheme: Scheme;
  survey: Survey;
  role: Role;
  user: User;
  respondent: UserSurveyAlias;
};

export const prepare = async (): Promise<MockData> => {
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
    questions: {},
    meals: [...defaultMeals],
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

  const role = await Role.create({ name: 'test-role', displayName: 'Test Role' });

  const user = await ioc.cradle.userService.create({
    email: 'testUser@example.com',
    password: 'testUserPassword',
    permissions: [],
    roles: [role.id],
  });

  const { respondent } = await ioc.cradle.surveyService.createRespondent('test-survey', {
    userName: 'testRespondent',
    password: 'testRespondentPassword',
  });

  return { language, locale, scheme, survey, role, user, respondent };
};

export const cleanup = async (): Promise<void> => {
  for (const model of Object.values(ioc.cradle.db.system.models)) {
    await model.truncate({ cascade: true });
  }
};
