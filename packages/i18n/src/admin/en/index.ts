import type { LocaleMessages } from 'vue-i18n';

import asServedSets from './as-served-sets';
import common from './common';
import dashboard from './dashboard';
import drinkwareSets from './drinkware-sets';
import fdbs from './fdbs';
import feedbackSchemes from './feedback-schemes';
import flags from './flags';
import foodGroups from './food-groups';
import guideImages from './guide-images';
import imageMaps from './image-maps';
import jobs from './jobs';
import languages from './languages';
import locales from './locales';
import nutrientTables from './nutrient-tables';
import nutrientTypes from './nutrient-types';
import permissions from './permissions';
import roles from './roles';
import signInLogs from './sign-in-logs';
import surveySchemeQuestions from './survey-scheme-questions';
import surveySchemes from './survey-schemes';
import surveys from './surveys';
import tasks from './tasks';
import user from './user';
import users from './users';

const messages: LocaleMessages = {
  common,
  dashboard,
  'drinkware-sets': drinkwareSets,
  fdbs,
  'feedback-schemes': feedbackSchemes,
  'food-groups': foodGroups,
  flags,
  'as-served-sets': asServedSets,
  'guide-images': guideImages,
  'image-maps': imageMaps,
  jobs,
  languages,
  locales,
  'nutrient-tables': nutrientTables,
  'nutrient-types': nutrientTypes,
  permissions,
  roles,
  'survey-schemes': surveySchemes,
  'survey-scheme-questions': surveySchemeQuestions,
  'sign-in-logs': signInLogs,
  surveys,
  tasks,
  user,
  users,
};

export default messages;
