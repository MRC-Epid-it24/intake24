import { randomUUID } from 'node:crypto';

import { faker } from '@faker-js/faker';
import slugify from 'slugify';

import type {
  CreateLanguageRequest,
  CreateLocaleRequest,
  CreateRespondentRequest,
  CreateSurveyRequest,
  CreateTaskRequest,
  CreateUserRequest,
  PermissionRequest,
  RoleRequest,
} from '@intake24/common/types/http/admin';
import type {
  FeedbackSchemeCreationAttributes,
  SurveySchemeCreationAttributes,
  SurveySchemeQuestionCreationAttributes,
} from '@intake24/db';
import {
  defaultTopFoods,
  feedbackOutputs,
  feedbackPhysicalDataFields,
} from '@intake24/common/feedback';
import { customPromptQuestions } from '@intake24/common/prompts';
import {
  defaultExport,
  defaultMeals,
  defaultQuestions,
  searchSortingAlgorithms,
} from '@intake24/common/surveys';
import { jobTypes } from '@intake24/common/types';
import { randomString } from '@intake24/common/util';

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
  const password = 'sUpErStRoNgPaSwOrD-123467890';
  const passwordConfirm = password;
  const phone = faker.phone.number();
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
  const username = faker.internet.userName();
  const name = faker.name.firstName();
  const email = faker.internet.email();
  const password = 'sUpErStRoNgPaSwOrD-123467890';
  const passwordConfirm = password;
  const phone = faker.phone.number();
  const customFields = [
    { name: faker.random.words(1), value: faker.random.words(5) },
    { name: faker.random.words(1), value: faker.random.words(5) },
  ];

  return {
    username,
    name,
    email,
    password,
    passwordConfirm,
    phone,
    customFields,
  };
};

const feedbackScheme = (): FeedbackSchemeCreationAttributes => {
  const name = faker.random.words(3);
  const type = 'default';

  return {
    name,
    type,
    outputs: [...feedbackOutputs],
    physicalDataFields: [...feedbackPhysicalDataFields],
    topFoods: defaultTopFoods,
    cards: [],
    demographicGroups: [
      {
        id: 'JzytAW',
        type: 'demographic-group',
        age: { start: 12, end: 1000 },
        height: null,
        weight: null,
        nutrientRuleType: 'percentage_of_energy',
        nutrientTypeId: '49',
        physicalActivityLevelId: null,
        sex: null,
        scaleSectors: [
          {
            name: { en: 'Total fat' },
            description: {
              en: '<p>It is recommended that the energy (or calories)...</p>',
            },
            range: { start: 0, end: 100 },
            sentiment: 'good',
          },
        ],
      },
    ],
    henryCoefficients: [
      {
        id: 'Jds83o',
        sex: 'm',
        age: { start: 0, end: 3 },
        weightCoefficient: 28.2,
        heightCoefficient: 859,
        constant: -371,
      },
    ],
  };
};

const language = (): CreateLanguageRequest => {
  const code = faker.address.countryCode();
  const englishName = faker.address.country();
  const localName = faker.address.country();
  const countryFlagCode = faker.address.countryCode();
  const textDirection = 'ltr';

  return {
    code,
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
  const code = faker.address.countryCode();
  const englishName = faker.address.country();
  const localName = faker.address.country();
  const respondentLanguageId = respLangId ?? faker.address.countryCode();
  const adminLanguageId = adminLangId ?? faker.address.countryCode();
  const countryFlagCode = faker.address.countryCode();
  const prototypeLocaleId = null;
  const textDirection = 'ltr';
  const foodIndexLanguageBackendId = 'en';

  return {
    code,
    englishName,
    localName,
    respondentLanguageId,
    adminLanguageId,
    countryFlagCode,
    prototypeLocaleId,
    textDirection,
    foodIndexLanguageBackendId,
  };
};

const surveyScheme = (): SurveySchemeCreationAttributes => {
  const name = faker.random.words(3);
  const type = 'default';

  return {
    name,
    type,
    questions: defaultQuestions,
    meals: defaultMeals,
    dataExport: defaultExport,
  };
};

const surveySchemeQuestion = (): SurveySchemeQuestionCreationAttributes => {
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

const survey = (
  surveySchemeId = '1',
  localeId = '1',
  feedbackSchemeId = null
): CreateSurveyRequest => {
  const slug = slugify(randomString(16), { strict: true });
  const name = faker.random.words(6);
  const state = 'notStarted';
  const startDate = new Date().toISOString().split('T')[0];
  const endDate = faker.date.future(1).toISOString().split('T')[0];
  const allowGenUsers = faker.datatype.boolean();
  const supportEmail = faker.internet.email();
  const suspensionReason = faker.random.words(10);

  const numberOfSubmissionsForFeedback = faker.datatype.number(10);
  const storeUserSessionOnServer = faker.datatype.boolean();

  const maximumDailySubmissions = faker.datatype.number({ min: 1, max: 5 });
  const minimumSubmissionInterval = faker.datatype.number(5);

  const authUrlDomainOverride = faker.internet.url();
  const authUrlTokenCharset = [
    ...new Set(randomString(30, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ').split('')),
  ].join('');
  const authUrlTokenLength = faker.datatype.number({ min: 10, max: 100 });

  const searchSortingAlgorithm =
    searchSortingAlgorithms[
      faker.datatype.number({ min: 0, max: searchSortingAlgorithms.length - 1 })
    ];
  const searchMatchScoreWeight = faker.datatype.number({ min: 0, max: 100 });

  const surveySchemeOverrides = {
    meals: [{ name: { en: faker.random.words(3) }, time: '8:00' }],
    questions: [],
  };

  const userPersonalIdentifiers = faker.datatype.boolean();
  const userCustomFields = faker.datatype.boolean();

  return {
    slug,
    name,
    state,
    startDate,
    endDate,
    surveySchemeId,
    localeId,
    allowGenUsers,
    supportEmail,
    suspensionReason,
    feedbackSchemeId,
    numberOfSubmissionsForFeedback,
    storeUserSessionOnServer,
    maximumDailySubmissions,
    minimumSubmissionInterval,
    authUrlDomainOverride,
    authUrlTokenCharset,
    authUrlTokenLength,
    searchSortingAlgorithm,
    searchMatchScoreWeight,
    surveySchemeOverrides,
    userPersonalIdentifiers,
    userCustomFields,
  };
};

const submission = (surveyId: string, userId: string) => {
  return {
    id: randomUUID(),
    surveyId,
    userId,
    startTime: new Date(),
    endTime: faker.date.soon(1),
    submissionTime: faker.date.soon(1),
    uxSessionId: randomUUID(),
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
  feedbackScheme,
  language,
  locale,
  permission,
  role,
  surveyScheme,
  surveySchemeQuestion,
  survey,
  submission,
  respondent,
  user,
  task,
};
