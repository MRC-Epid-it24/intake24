import db from '@/db';
import { Locale, Scheme, Survey, User, UserSurveyAlias, Role } from '@/db/models/system';
import userSvc from '@/services/user.service';
import surveySvc from '@/services/survey.service';
import { setupPermissions } from './helpers';

export type MockData = {
  locale: Locale;
  scheme: Scheme;
  survey: Survey;
  role: Role;
  user: User;
  respondent: UserSurveyAlias;
};

export const prepare = async (): Promise<MockData> => {
  const locale = await Locale.create({
    id: 'en_GB',
    englishName: 'UK',
    localName: 'UK',
    respondentLanguageId: 'en_GB',
    adminLanguageId: 'en',
    countryFlagCode: 'gb',
    prototypeLocaleId: null,
    textDirection: 'ltr',
  });

  const scheme = await Scheme.create({
    id: 'test-scheme',
    name: 'Test Scheme',
    type: 'data-driven',
    questions: {},
    meals: [],
  });

  const today = new Date();

  const survey = await Survey.create({
    id: 'test-survey',
    state: 0,
    startDate: today,
    endDate: new Date().setDate(today.getDate() + 7),
    schemeId: 'test-scheme',
    locale: 'en_GB',
    allowGenUsers: false,
    supportEmail: 'testSupportEmail@example.com',
  });

  await setupPermissions();

  const role = await Role.create({ name: 'test-role', displayName: 'Test Role' });

  const user = await userSvc.create({
    email: 'testUser@example.com',
    password: 'testUserPassword',
    permissions: [],
    roles: [role.id],
  });

  const { respondent } = await surveySvc.createRespondent('test-survey', {
    userName: 'testRespondent',
    password: 'testRespondentPassword',
  });

  return { locale, scheme, survey, role, user, respondent };
};

export const cleanup = async (): Promise<void> => {
  for (const model of Object.values(db.system.models)) {
    await model.truncate({ cascade: true });
  }
};
