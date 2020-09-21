import { Meal } from '@common/types/meals';
import { RecallQuestions } from '@common/types/recall';
import { CreateUserRequest } from '@common/types/api/admin/users';
import faker from 'faker';

export type PermissionInput = {
  name: string;
  displayName: string;
  description: string;
};

export const permission = (): PermissionInput => {
  const displayName = faker.random.words(2);
  const name = faker.helpers.slugify(displayName);
  const description = faker.lorem.words(10);

  return { name, displayName, description };
};

export type RoleInput = {
  name: string;
  displayName: string;
  description: string;
  permissions: number[] | string[];
};

export const role = (): RoleInput => {
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

type SchemeInput = {
  id: string;
  name: string;
  type: string;
  questions: RecallQuestions;
  meals: Meal[];
};

export const scheme = (): SchemeInput => {
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

export type SurveyInput = {
  id: string;
  state: number;
  startDate: string;
  endDate: string;
  schemeId: string;
  locale: string;
  allowGenUsers: boolean;
  supportEmail: string;
  feedbackEnabled: boolean;
  numberOfSubmissionsForFeedback: number;
  storeUserSessionOnServer: boolean;
};

export const survey = (schemeId = 'default', locale = 'en_GB'): SurveyInput => {
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
    locale,
    allowGenUsers,
    supportEmail,
    feedbackEnabled,
    numberOfSubmissionsForFeedback,
    storeUserSessionOnServer,
  };
};
