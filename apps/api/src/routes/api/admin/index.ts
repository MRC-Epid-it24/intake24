import { Router } from 'express';

import { authenticate, isAccountVerified } from '@intake24/api/http/middleware';

import authentication from './authentication';
import fdbs from './fdbs';
import feedbackSchemes from './feedback-schemes';
import foodGroups from './food-groups';
import images from './images';
import jobs from './jobs';
import languages from './languages';
import locales from './locales';
import nutrientTables from './nutrient-tables';
import permissions from './permissions';
import profile from './profile';
import references from './references';
import roles from './roles';
import signInLogs from './sign-in-logs';
import signup from './signup';
import surveySchemeQuestions from './survey-scheme-questions';
import surveySchemes from './survey-schemes';
import surveys from './surveys';
import tasks from './tasks';
import user from './user';
import users from './users';

export default () => {
  const router = Router();

  // Unauthenticated
  router.use('/auth', authentication());
  router.use('/signup', signup());

  // Authenticated & not verified
  authenticate(router, 'admin');

  router.use('/user', profile());

  // Authenticated & verified
  router.use(isAccountVerified);

  router.use('/fdbs', fdbs());
  router.use('/feedback-schemes', feedbackSchemes());
  router.use('/food-groups', foodGroups());
  router.use('/images', images());
  router.use('/jobs', jobs());
  router.use('/languages', languages());
  router.use('/locales', locales());
  router.use('/nutrient-tables', nutrientTables());
  router.use('/permissions', permissions());
  router.use('/references', references());
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
