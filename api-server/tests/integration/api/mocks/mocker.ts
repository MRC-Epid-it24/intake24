import faker from 'faker';
import { PermissionRequest } from '@common/types/api/admin/permissions';
import { RoleRequest } from '@common/types/api/admin/roles';
import { CreateLocaleRequest } from '@common/types/api/admin/locales';
import { CreateSchemeRequest } from '@common/types/api/admin/schemes';
import { CreateSurveyRequest } from '@common/types/api/admin/surveys';
import { CreateUserRequest } from '@common/types/api/admin/users';
import { Meal } from '@common/types/meals';
import { RecallQuestions } from '@common/types/recall';

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

export const locale = (): CreateLocaleRequest => {
  const id = faker.address.countryCode();
  const englishName = faker.address.country();
  const localName = faker.address.country();
  const respondentLanguageId = faker.address.countryCode();
  const adminLanguageId = faker.address.countryCode();
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
  const id = faker.random.words(1);
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
  };
};
