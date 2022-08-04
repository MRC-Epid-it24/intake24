import acl from './acl';

import foods from './foods';
import images from './images';
import locales from './locales';
import surveys from './surveys';
import user from './user';

import authentication from './authentication.controller';
import feedbackScheme from './feedback-scheme.controller';
import job from './job.controller';
import language from './language.controller';
import languageTranslation from './language-translation.controller';

import nutrientTable from './nutrient-table.controller';
import signInLog from './sign-in-log.controller';
import surveyScheme from './survey-scheme.controller';
import surveySchemeQuestion from './survey-scheme-question.controller';
import task from './task.controller';

export * from './acl';
export * from './foods';
export * from './images';
export * from './locales';
export * from './surveys';
export * from './user';

export * from './authentication.controller';
export * from './feedback-scheme.controller';
export * from './job.controller';
export * from './language.controller';
export * from './language-translation.controller';
export * from './nutrient-table.controller';
export * from './securable.controller';
export * from './sign-in-log.controller';
export * from './survey-scheme.controller';
export * from './survey-scheme-question.controller';
export * from './task.controller';

export default {
  acl,
  authentication,
  user,
  foods,
  images,
  surveys,
  feedbackScheme,
  job,
  language,
  languageTranslation,
  locales,
  nutrientTable,
  surveyScheme,
  surveySchemeQuestion,
  signInLog,
  task,
};
