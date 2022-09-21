import acl from './acl';
import authentication from './authentication.controller';
import feedbackScheme from './feedback-scheme.controller';
import foods from './foods';
import images from './images';
import job from './job.controller';
import language from './language.controller';
import languageTranslation from './language-translation.controller';
import locales from './locales';
import nutrientTable from './nutrient-table.controller';
import reference from './reference.controller';
import signInLog from './sign-in-log.controller';
import signup from './signup.controller';
import surveyScheme from './survey-scheme.controller';
import surveySchemeQuestion from './survey-scheme-question.controller';
import surveys from './surveys';
import task from './task.controller';
import user from './user';

export * from './acl';
export * from './authentication.controller';
export * from './feedback-scheme.controller';
export * from './foods';
export * from './images';
export * from './job.controller';
export * from './language.controller';
export * from './language-translation.controller';
export * from './locales';
export * from './nutrient-table.controller';
export * from './reference.controller';
export * from './securable.controller';
export * from './sign-in-log.controller';
export * from './signup.controller';
export * from './survey-scheme.controller';
export * from './survey-scheme-question.controller';
export * from './surveys';
export * from './task.controller';
export * from './user';

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
  reference,
  signInLog,
  signup,
  surveyScheme,
  surveySchemeQuestion,
  task,
};
