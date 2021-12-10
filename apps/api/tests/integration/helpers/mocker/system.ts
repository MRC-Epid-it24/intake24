import faker from 'faker';
import { nanoid } from 'nanoid';
import slugify from 'slugify';
import * as uuid from 'uuid';
import { jobTypes } from '@common/types';
import {
  PermissionRequest,
  RoleRequest,
  CreateLocaleRequest,
  CreateSurveyRequest,
  CreateTaskRequest,
  CreateUserRequest,
  CreateLanguageRequest,
  CreateRespondentRequest,
} from '@common/types/http/admin';
import {
  SchemeCreationAttributes,
  SchemeQuestionCreationAttributes,
  SchemeTypes,
  surveyStates,
} from '@common/types/models';
import { defaultExport, defaultMeals, defaultQuestions } from '@common/schemes';
import { customPromptQuestions } from '@common/prompts';

const permission = (): PermissionRequest => {
  const displayName = faker.random.words(2);
  const name = slugify(displayName, { strict: true });
  const description = faker.lorem.words(10);

  return { name, displayName, description };
};

const role = (): RoleRequest => {
  const displayName = faker.random.words(2);
  const name = slugify(displayName, { strict: true });
  const description = faker.lorem.words(10);
  const permissions: string[] = [];

  return { name, displayName, description, permissions };
};

const user = (): CreateUserRequest => {
  const name = faker.name.firstName();
  const email = faker.internet.email();
  const password = nanoid(20);
  const passwordConfirm = password;
  const phone = faker.phone.phoneNumber();
  const multiFactorAuthentication = false;
  const emailNotifications = faker.datatype.boolean();
  const smsNotifications = faker.datatype.boolean();
  const customFields = [
    { name: faker.random.words(1), value: faker.random.words(5) },
    { name: faker.random.words(1), value: faker.random.words(5) },
  ];

  const permissions: string[] = [];
  const roles: string[] = [];

  return {
    name,
    email,
    password,
    passwordConfirm,
    phone,
    multiFactorAuthentication,
    emailNotifications,
    smsNotifications,
    customFields,
    permissions,
    roles,
  };
};

const respondent = (): CreateRespondentRequest => {
  const userName = faker.internet.userName();
  const name = faker.name.firstName();
  const email = faker.internet.email();
  const password = nanoid(20);
  const passwordConfirm = password;
  const phone = faker.phone.phoneNumber();
  const customFields = [
    { name: faker.random.words(1), value: faker.random.words(5) },
    { name: faker.random.words(1), value: faker.random.words(5) },
  ];

  return {
    userName,
    name,
    email,
    password,
    passwordConfirm,
    phone,
    customFields,
  };
};

const language = (): CreateLanguageRequest => {
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

const locale = (
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

const scheme = (): SchemeCreationAttributes => {
  const id = slugify(nanoid(16), { strict: true });
  const name = faker.random.words(3);
  const type = SchemeTypes.DATA_DRIVEN;

  return {
    id,
    name,
    type,
    questions: defaultQuestions,
    meals: defaultMeals,
    export: defaultExport,
  };
};

const schemeQuestion = (): SchemeQuestionCreationAttributes => {
  const question = {
    ...customPromptQuestions[
      faker.datatype.number({ min: 0, max: customPromptQuestions.length - 1 })
    ],
    id: slugify(faker.random.words(6), { strict: true }),
    name: faker.random.words(6),
  };

  return {
    questionId: question.id,
    name: question.name,
    question,
  };
};

const survey = (schemeId = 'default', localeId = 'en_GB'): CreateSurveyRequest => {
  const id = slugify(nanoid(16), { strict: true });
  const name = faker.random.words(6);
  const state = surveyStates.NOT_STARTED;
  const startDate = new Date().toISOString().split('T')[0];
  const endDate = faker.date.future(1).toISOString().split('T')[0];
  const allowGenUsers = faker.datatype.boolean();
  const supportEmail = faker.internet.email();

  const feedbackEnabled = faker.datatype.boolean();
  const numberOfSubmissionsForFeedback = faker.datatype.number(10);
  const storeUserSessionOnServer = faker.datatype.boolean();

  const maximumDailySubmissions = faker.datatype.number({ min: 1, max: 5 });
  const minimumSubmissionInterval = faker.datatype.number(5);
  const overrides = { meals: [], questions: [] };

  return {
    id,
    name,
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
    overrides,
  };
};

const submission = (surveyId: string, userId: string) => {
  return {
    id: uuid.v4(),
    surveyId,
    userId,
    startTime: new Date(),
    endTime: faker.date.soon(1),
    submissionTime: faker.date.soon(1),
    uxSessionId: uuid.v4(),
  };
};

const task = (): CreateTaskRequest => {
  const name = faker.random.words(3);
  const job = jobTypes[0];
  const cron = '0 * * * *';
  const active = true;
  const description = faker.random.words(10);
  const params = {};

  return {
    name,
    job,
    cron,
    active,
    description,
    params,
  };
};

export default {
  language,
  locale,
  permission,
  role,
  scheme,
  schemeQuestion,
  survey,
  submission,
  respondent,
  user,
  task,
};
