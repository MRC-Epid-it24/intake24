import type { LocaleMessages } from 'vue-i18n';

import asServedSets from './as-served-sets.json';
import common from './common.json';
import dashboard from './dashboard.json';
import drinkwareSets from './drinkware-sets.json';
import fdbs from './fdbs.json';
import feedbackSchemes from './feedback-schemes.json';
import foodGroups from './food-groups.json';
import guideImages from './guide-images.json';
import imageMaps from './image-maps.json';
import jobs from './jobs.json';
import languages from './languages.json';
import locales from './locales.json';
import nutrientTables from './nutrient-tables.json';
import nutrientTypes from './nutrient-types.json';
import nutrientUnits from './nutrient-units.json';
import permissions from './permissions.json';
import roles from './roles.json';
import securables from './securables.json';
import signInLogs from './sign-in-logs.json';
import standardUnits from './standard-units.json';
import surveySchemePrompts from './survey-scheme-prompts.json';
import surveySchemes from './survey-schemes.json';
import surveys from './surveys.json';
import tasks from './tasks.json';
import user from './user.json';
import users from './users.json';

const messages: LocaleMessages = {
  common,
  dashboard,
  'drinkware-sets': drinkwareSets,
  fdbs,
  'feedback-schemes': feedbackSchemes,
  'food-groups': foodGroups,
  'as-served-sets': asServedSets,
  'guide-images': guideImages,
  'image-maps': imageMaps,
  jobs,
  languages,
  locales,
  'nutrient-tables': nutrientTables,
  'nutrient-types': nutrientTypes,
  'nutrient-units': nutrientUnits,
  permissions,
  roles,
  securables,
  'sign-in-logs': signInLogs,
  'standard-units': standardUnits,
  'survey-schemes': surveySchemes,
  'survey-scheme-prompts': surveySchemePrompts,
  surveys,
  tasks,
  user,
  users,
};

export default messages;
