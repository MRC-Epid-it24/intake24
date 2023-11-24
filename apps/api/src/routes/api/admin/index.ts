import { Router } from 'express';

import { authenticate, isAccountVerified } from '@intake24/api/http/middleware';

import authentication from './authentication';
import categories from './categories';
import fdbs from './fdbs';
import feedbackSchemes from './feedback-schemes';
import foodGroups from './food-groups';
import foods from './foods';
import images from './images';
import jobs from './jobs';
import languages from './languages';
import locales from './locales';
import nutrientTables from './nutrient-tables';
import nutrientTypes from './nutrient-types';
import nutrientUnits from './nutrient-units';
import permissions from './permissions';
import profile from './profile';
import references from './references';
import roles from './roles';
import signInLogs from './sign-in-logs';
import signup from './signup';
import standardUnits from './standard-units';
import surveySchemePrompts from './survey-scheme-prompts';
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

  router.use('/categories', categories());
  router.use('/fdbs', fdbs());
  router.use('/foods', foods());
  router.use('/feedback-schemes', feedbackSchemes());
  router.use('/food-groups', foodGroups());
  router.use('/images', images());
  router.use('/jobs', jobs());
  router.use('/languages', languages());
  router.use('/locales', locales());
  router.use('/nutrient-tables', nutrientTables());
  router.use('/nutrient-types', nutrientTypes());
  router.use('/nutrient-units', nutrientUnits());
  router.use('/permissions', permissions());
  router.use('/references', references());
  router.use('/roles', roles());
  router.use('/sign-in-logs', signInLogs());
  router.use('/standard-units', standardUnits());
  router.use('/survey-schemes', surveySchemes());
  router.use('/survey-scheme-prompts', surveySchemePrompts());
  router.use('/surveys', surveys());
  router.use('/tasks', tasks());
  router.use('/user', user());
  router.use('/users', users());

  return router;
};
