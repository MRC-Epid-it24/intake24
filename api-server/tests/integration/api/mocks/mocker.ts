import faker from 'faker';
import jobs from '@/jobs';
import {
  PermissionRequest,
  RoleRequest,
  CreateLocaleRequest,
  CreateSchemeRequest,
  CreateSurveyRequest,
  CreateTaskRequest,
  CreateUserRequest,
  CreateLanguageRequest,
} from '@common/types/http';
import { Meal, RecallQuestions } from '@common/types';
import { defaultExport } from '@common/defaults';

export const permission = (): PermissionRequest => {
  const displayName = faker.random.words(2);
  const name = faker.helpers.slugify(displayName);
  const description = faker.lorem.words(10);

  return { name, displayName, description };
};

export const role = (): RoleRequest => {
  const displayName = faker.random.words(2);
  const name = faker.helpers.slugify(displayName);
  const description = faker.lorem.words(10);
  const permissions: number[] = [];

  return { name, displayName, description, permissions };
};

export const user = (): CreateUserRequest => {
  const name = faker.name.firstName();
  const email = faker.internet.email();
  const password = faker.internet.password();
  const passwordConfirm = password;
  const phone = faker.phone.phoneNumber();
  const multiFactorAuthentication = false;
  const emailNotifications = faker.random.boolean();
  const smsNotifications = faker.random.boolean();

  const permissions: number[] = [];
  const roles: number[] = [];

  return {
    name,
    email,
    password,
    passwordConfirm,
    phone,
    multiFactorAuthentication,
    emailNotifications,
    smsNotifications,
    permissions,
    roles,
  };
};

export const language = (): CreateLanguageRequest => {
  const id = faker.address.countryCode();
  const englishName = faker.address.country();
  const localName = faker.address.country();
  const countryFlagCode = faker.address.countryCode();
  const textDirection = 'ltr';

  return {
    id,
    englishName,
    localName,
    countryFlagCode,
    textDirection,
  };
};

export const locale = (
  respLangId: string | undefined,
  adminLangId: string | undefined
): CreateLocaleRequest => {
  const id = faker.address.countryCode();
  const englishName = faker.address.country();
  const localName = faker.address.country();
  const respondentLanguageId = respLangId ?? faker.address.countryCode();
  const adminLanguageId = adminLangId ?? faker.address.countryCode();
  const countryFlagCode = faker.address.countryCode();
  const prototypeLocaleId = null;
  const textDirection = 'ltr';

  return {
    id,
    englishName,
    localName,
    respondentLanguageId,
    adminLanguageId,
    countryFlagCode,
    prototypeLocaleId,
    textDirection,
  };
};

export const scheme = (): CreateSchemeRequest => {
  const id = faker.helpers.slugify(faker.random.words(2));
  const name = faker.random.words(3);
  const type = 'data-driven';
  const questions = {} as RecallQuestions;
  const meals: Meal[] = [];

  return {
    id,
    name,
    type,
    questions,
    meals,
    export: defaultExport,
  };
};

export const survey = (schemeId = 'default', localeId = 'en_GB'): CreateSurveyRequest => {
  const id = faker.helpers.slugify(faker.random.words(2));
  const state = faker.random.number(2);
  const startDate = new Date().toISOString().split('T')[0];
  const endDate = faker.date.future(1).toISOString().split('T')[0];
  const allowGenUsers = faker.random.boolean();
  const supportEmail = faker.internet.email();

  const feedbackEnabled = faker.random.boolean();
  const numberOfSubmissionsForFeedback = faker.random.number(10);
  const storeUserSessionOnServer = faker.random.boolean();

  const maximumDailySubmissions = faker.random.number({ min: 1, max: 5 });
  const minimumSubmissionInterval = faker.random.number(5);

  return {
    id,
    state,
    startDate,
    endDate,
    schemeId,
    localeId,
    allowGenUsers,
    supportEmail,
    feedbackEnabled,
    numberOfSubmissionsForFeedback,
    storeUserSessionOnServer,
    maximumDailySubmissions,
    minimumSubmissionInterval,
  };
};

export const task = (): CreateTaskRequest => {
  const name = faker.random.words(3);
  const job = Object.keys(jobs)[0];
  const cron = '0 * * * *';
  const active = true;
  const description = faker.random.words(10);

  return {
    name,
    job,
    cron,
    active,
    description,
  };
};
