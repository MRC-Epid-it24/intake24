import { randomUUID } from 'node:crypto';

import { faker } from '@faker-js/faker';
import { times } from 'lodash';
import slugify from 'slugify';

import type {
  CreateRespondentRequest,
  LanguageRequest,
  LocaleRequest,
  PermissionRequest,
  RoleRequest,
  SurveyCreateRequest,
  TaskRequest,
  UserRequest,
} from '@intake24/common/types/http/admin';
import type {
  FeedbackSchemeCreationAttributes,
  SurveySchemeCreationAttributes,
  SurveySchemePromptCreationAttributes,
} from '@intake24/db';
import {
  defaultMeals as defaultFeedbackMeals,
  defaultTopFoods as defaultFeedbackTopFoods,
  feedbackOutputs as defaultFeedbackOutputs,
  feedbackPhysicalDataFields,
  feedbackSections as defaultFeedbackSections,
} from '@intake24/common/feedback';
import { customPrompts } from '@intake24/common/prompts';
import { createAmrMethod, recordVisibilities } from '@intake24/common/security';
import {
  defaultExport,
  defaultMeals,
  defaultPrompts,
  defaultSchemeSettings,
  searchSortingAlgorithms,
  spellingCorrectionPreferences,
} from '@intake24/common/surveys';
import { CustomField, jobTypes } from '@intake24/common/types';
import { randomString } from '@intake24/common/util';

function permission(): PermissionRequest {
  const displayName = faker.word.words(2);
  const name = slugify(displayName, { strict: true });
  const description = faker.lorem.words(10);

  return { name, displayName, description };
}

function role(): RoleRequest {
  const displayName = faker.word.words(2);
  const name = slugify(displayName, { strict: true });
  const description = faker.lorem.words(10);
  const permissions: string[] = [];

  return { name, displayName, description, permissions };
}

function user(): UserRequest {
  const name = faker.person.firstName();
  const email = faker.internet.email();
  const password = 'sUpErStRoNgPaSwOrD-123467890';
  const passwordConfirm = password;
  const phone = faker.phone.number();
  const multiFactorAuthentication = false;
  const emailNotifications = faker.datatype.boolean();
  const smsNotifications = faker.datatype.boolean();
  const customFields = times(3, () => customField());

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
}

function customField(): CustomField {
  return { name: randomString(10), value: faker.word.words(5) };
}

function respondent(): CreateRespondentRequest {
  const username = faker.internet.userName();
  const name = faker.person.firstName();
  const email = faker.internet.email();
  const password = 'sUpErStRoNgPaSwOrD-123467890';
  const passwordConfirm = password;
  const phone = faker.phone.number();
  const customFields = times(5, () => customField());

  return {
    username,
    name,
    email,
    password,
    passwordConfirm,
    phone,
    customFields,
  };
}

function feedbackScheme(): FeedbackSchemeCreationAttributes {
  const name = faker.word.words(3);
  const type = 'default';

  return {
    name,
    type,
    visibility: 'public',
    outputs: [...defaultFeedbackOutputs],
    physicalDataFields: [...feedbackPhysicalDataFields],
    sections: [...defaultFeedbackSections],
    topFoods: { ...defaultFeedbackTopFoods },
    meals: { ...defaultFeedbackMeals },
    cards: [],
    demographicGroups: [
      {
        id: 'JzytAW',
        type: 'character',
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
            summary: { en: 'Total fat' },
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
}

function language(): LanguageRequest {
  const code = faker.location.countryCode();
  const englishName = faker.location.country();
  const localName = faker.location.country();
  const countryFlagCode = faker.location.countryCode();
  const textDirection = 'ltr';
  const visibility = recordVisibilities[faker.number.int({ min: 0, max: 1 })];

  return {
    code,
    englishName,
    localName,
    countryFlagCode,
    textDirection,
    visibility,
  };
}

function locale(respLangId: string | undefined, adminLangId: string | undefined): LocaleRequest {
  const code = faker.location.countryCode();
  const englishName = faker.location.country();
  const localName = faker.location.country();
  const respondentLanguageId = respLangId ?? faker.location.countryCode();
  const adminLanguageId = adminLangId ?? faker.location.countryCode();
  const countryFlagCode = faker.location.countryCode();
  const prototypeLocaleId = null;
  const textDirection = 'ltr';
  const foodIndexEnabled = faker.datatype.boolean();
  const foodIndexLanguageBackendId = 'en';
  const visibility = recordVisibilities[faker.number.int({ min: 0, max: 1 })];

  return {
    code,
    englishName,
    localName,
    respondentLanguageId,
    adminLanguageId,
    countryFlagCode,
    prototypeLocaleId,
    textDirection,
    foodIndexEnabled,
    foodIndexLanguageBackendId,
    visibility,
  };
}

function personalAccessToken() {
  const name = faker.word.words(3);
  const expiresAt = faker.date.future({ years: 1 });
  const verified = true;
  const aal = 'aal1' as const;
  const amr = [createAmrMethod('pwd')];

  return {
    name,
    expiresAt,
    verified,
    aal,
    amr,
  };
}

function surveyScheme(): SurveySchemeCreationAttributes {
  const name = faker.word.words(3);
  const visibility = recordVisibilities[faker.number.int({ min: 0, max: 1 })];

  return {
    name,
    settings: defaultSchemeSettings,
    visibility,
    prompts: defaultPrompts,
    meals: defaultMeals,
    dataExport: defaultExport,
  };
}

function surveySchemePrompt(): SurveySchemePromptCreationAttributes {
  const prompt = {
    ...customPrompts[faker.number.int({ min: 0, max: customPrompts.length - 1 })],
    id: slugify(faker.word.words(6), { strict: true }),
    name: faker.word.words(6),
  };

  return {
    promptId: prompt.id,
    name: prompt.name,
    prompt,
  };
}

function survey(surveySchemeId = '1', localeId = '1', feedbackSchemeId = null): SurveyCreateRequest {
  const slug = slugify(randomString(16), { strict: true });
  const name = faker.word.words(6);
  const state = 'notStarted';
  const startDate = new Date();
  const endDate = faker.date.future({ years: 1 });
  const allowGenUsers = faker.datatype.boolean();
  const supportEmail = faker.internet.email();
  const suspensionReason = faker.word.words(10);

  const numberOfSubmissionsForFeedback = faker.number.int({ min: 1, max: 10 });
  const session = {
    store: faker.datatype.boolean(),
    age: '12h',
    fixed: '1d+0h',
  };

  const maximumDailySubmissions = faker.number.int({ min: 1, max: 5 });
  const minimumSubmissionInterval = faker.number.int({ min: 1, max: 1000000 });

  const authCaptcha = faker.datatype.boolean();
  const authUrlDomainOverride = faker.internet.url();
  const authUrlTokenCharset = [
    ...new Set(randomString(30, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ').split('')),
  ].join('');
  const authUrlTokenLength = faker.number.int({ min: 12, max: 100 });

  const searchSettings = {
    collectData: faker.datatype.boolean(),
    maxResults: faker.number.int({ min: 10, max: 100 }),
    matchScoreWeight: faker.number.int({ min: 0, max: 100 }),
    sortingAlgorithm: searchSortingAlgorithms[faker.number.int({
      min: 0,
      max: searchSortingAlgorithms.length - 1,
    })],
    minWordLength1: faker.number.int({ min: 2, max: 10 }),
    minWordLength2: faker.number.int({ min: 3, max: 10 }),
    spellingCorrectionPreference: spellingCorrectionPreferences[faker.number.int({ min: 0, max: spellingCorrectionPreferences.length - 1 })],
    enableEditDistance: faker.datatype.boolean(),
    enablePhonetic: faker.datatype.boolean(),
    minWordLengthPhonetic: faker.number.int({ min: 2, max: 10 }),
    firstWordCost: faker.number.int({ min: 0, max: 20 }),
    wordOrderCost: faker.number.int({ min: 0, max: 10 }),
    wordDistanceCost: faker.number.int({ min: 0, max: 10 }),
    unmatchedWordCost: faker.number.int({ min: 0, max: 10 }),
    enableRelevantCategories: faker.datatype.boolean(),
    relevantCategoryDepth: faker.number.int({ min: 0, max: 5 }),
  };

  const surveySchemeOverrides = {
    meals: [{ name: { en: faker.word.words(3) }, time: '8:00' }],
    prompts: [],
    settings: {},
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
    notifications: [],
    supportEmail,
    suspensionReason,
    feedbackSchemeId,
    numberOfSubmissionsForFeedback,
    session,
    maximumDailySubmissions,
    minimumSubmissionInterval,
    authCaptcha,
    authUrlDomainOverride,
    authUrlTokenCharset,
    authUrlTokenLength,
    searchSettings,
    surveySchemeOverrides,
    userPersonalIdentifiers,
    userCustomFields,
  };
}

function submission(surveyId: string, userId: string) {
  return {
    id: randomUUID(),
    surveyId,
    userId,
    startTime: new Date(),
    endTime: faker.date.soon({ days: 1 }),
    submissionTime: faker.date.soon({ days: 1 }),
    sessionId: randomUUID(),
  };
}

function task(): TaskRequest {
  const name = faker.word.words(3);
  const job = jobTypes[0];
  const cron = '0 * * * *';
  const active = true;
  const description = faker.word.words(10);
  const params = {};

  return {
    name,
    job,
    cron,
    active,
    description,
    params,
  };
}

export default {
  customField,
  feedbackScheme,
  language,
  locale,
  personalAccessToken,
  permission,
  role,
  surveyScheme,
  surveySchemePrompt,
  survey,
  submission,
  respondent,
  user,
  task,
};
