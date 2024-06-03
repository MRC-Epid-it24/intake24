import acl from './acl';
import { authentication } from './authentication.contract';
import { feedbackScheme } from './feedback-scheme.contract';
import { foodDb } from './food-db.contract';
import { foodGroup } from './food-group.contract';
import { job } from './job.contract';
import { language } from './language.contract';
import { languageTranslation } from './language-translation.contract';
import { nutrientTable } from './nutrient-table.contract';
import { nutrientType } from './nutrient-type.contract';
import { nutrientUnit } from './nutrient-unit.contract';
import { reference } from './reference.contract';
import { securable } from './securable.contract';
import { signInLog } from './sign-in-log.contract';
import { signUp } from './sign-up.contract';
import { standardUnit } from './standard-unit.contract';
import survey from './survey';
import { surveyScheme } from './survey-scheme.contract';
import { surveySchemePrompt } from './survey-scheme-prompt.contract';
import { task } from './task.contract';
import user from './user';

export default {
  acl,
  authentication,
  feedbackScheme,
  feedbackSchemeSecurable: securable('FeedbackScheme', '/admin/feedback-schemes/:feedbackSchemeId'),
  foodDb,
  foodGroup,
  job,
  language,
  languageTranslation,
  languageSecurable: securable('Language', '/admin/languages/:languageId'),
  localeSecurable: securable('Locale', '/admin/locales/:localeId'),
  nutrientTable,
  nutrientType,
  nutrientUnit,
  reference,
  signInLog,
  signUp,
  standardUnit,
  survey,
  surveySecurable: securable('Survey', '/admin/surveys/:surveyId'),
  surveyScheme,
  surveySchemePrompt,
  surveySchemeSecurable: securable('SurveyScheme', '/admin/survey-schemes/:surveySchemeId'),
  task,
  user,
};
