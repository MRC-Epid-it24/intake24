import faker from 'faker';
import { nanoid } from 'nanoid';
import slugify from 'slugify';
import { jobTypes } from '@common/types';
import {
  PermissionRequest,
  RoleRequest,
  CreateLocaleRequest,
  CreateSurveyRequest,
  CreateTaskRequest,
  CreateUserRequest,
  CreateLanguageRequest,
  CreateAsServedSetInput,
} from '@common/types/http/admin';
import {
  SchemeCreationAttributes,
  SchemeQuestionCreationAttributes,
  SchemeTypes,
} from '@common/types/models';
import { defaultExport, defaultMeals, defaultQuestions } from '@common/schemes';
import { customPromptQuestions } from '@common/prompts';
import { downloadImage } from '../util';

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
  const password = faker.internet.password();
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

const asServedSet = async (asServedSetId?: string): Promise<CreateAsServedSetInput> => {
  const id = asServedSetId ?? nanoid(32);
  const originalname = `${id}.jpg`;

  const filePath = await downloadImage('https://picsum.photos/1200/800.jpg', originalname);

  return {
    id,
    description: `${id}_description`,
    file: { originalname: `${id}.jpg`, path: filePath },
    uploader: 'admin',
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
  const state = faker.datatype.number(2);
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
  user,
  task,
};
