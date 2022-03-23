import { Router } from 'express';
import { authenticate } from '@intake24/api/http/middleware/acl';

import fdbs from './fdbs';
import feedbackSchemes from './feedback-schemes';
import foodGroups from './food-groups';
import images from './images';
import jobs from './jobs';
import languages from './languages';
import locales from './locales';
import nutrientTables from './nutrient-tables';
import permissions from './permissions';
import roles from './roles';
import surveySchemes from './survey-schemes';
import surveySchemeQuestions from './survey-scheme-questions';
import signInLogs from './sign-in-logs';
import surveys from './surveys';
import tasks from './tasks';
import user from './user';
import users from './users';

export default () => {
  const router = Router();

  authenticate(router, 'admin');

  router.use('/fdbs', fdbs());
  router.use('/feedback-schemes', feedbackSchemes());
  router.use('/food-groups', foodGroups());
  router.use('/images', images());
  router.use('/jobs', jobs());
  router.use('/languages', languages());
  router.use('/locales', locales());
  router.use('/nutrient-tables', nutrientTables());
  router.use('/permissions', permissions());
  router.use('/roles', roles());
  router.use('/survey-schemes', surveySchemes());
  router.use('/survey-scheme-questions', surveySchemeQuestions());
  router.use('/sign-in-logs', signInLogs());
  router.use('/surveys', surveys());
  router.use('/tasks', tasks());
  router.use('/user', user());
  router.use('/users', users());

  return router;
};
