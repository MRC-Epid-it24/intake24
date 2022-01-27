import { Dictionary } from '@intake24/common/types';
import authentication from './authentication';
import dashboard from './dashboard.vue';
import fdbs from './fdbs';
import feedbackSchemes from './feedback-schemes';
import foodGroups from './food-groups';
import images from './images';
import jobs from './jobs';
import languages from './languages';
import locales from './locales';
import nutrientTables from './nutrient-tables';
import surveySchemes from './survey-schemes';
import surveySchemeQuestions from './survey-scheme-questions';
import signInLogs from './sign-in-logs';
import surveys from './surveys';
import permissions from './permissions';
import roles from './roles';
import tasks from './tasks';
import user from './user';
import users from './users';

const views: Dictionary = {
  authentication,
  dashboard,
  fdbs,
  'feedback-schemes': feedbackSchemes,
  'food-groups': foodGroups,
  images,
  jobs,
  languages,
  locales,
  'nutrient-tables': nutrientTables,
  'survey-schemes': surveySchemes,
  'survey-scheme-questions': surveySchemeQuestions,
  'sign-in-logs': signInLogs,
  surveys,
  permissions,
  roles,
  tasks,
  user,
  users,
};

export default views;
