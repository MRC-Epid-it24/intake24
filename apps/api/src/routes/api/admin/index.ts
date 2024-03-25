import { Router } from 'express';

import { authenticate, isAccountVerified } from '@intake24/api/http/middleware';

import categories from './categories';
import fdbs from './fdbs';
import feedbackSchemes from './feedback-schemes';
import foodGroups from './food-groups';
import foods from './foods';
import images from './images';
import languages from './languages';
import locales from './locales';
import permissions from './permissions';
import references from './references';
import roles from './roles';
import surveySchemePrompts from './survey-scheme-prompts';
import surveySchemes from './survey-schemes';
import surveys from './surveys';
import users from './users';

export default () => {
  const router = Router();

  // Authenticated & verified
  authenticate(router, 'admin');
  router.use(isAccountVerified);

  router.use('/categories', categories());
  router.use('/fdbs', fdbs());
  router.use('/foods', foods());
  router.use('/feedback-schemes', feedbackSchemes());
  router.use('/food-groups', foodGroups());
  router.use('/images', images());
  router.use('/languages', languages());
  router.use('/locales', locales());
  router.use('/permissions', permissions());
  router.use('/references', references());
  router.use('/roles', roles());
  router.use('/survey-schemes', surveySchemes());
  router.use('/survey-scheme-prompts', surveySchemePrompts());
  router.use('/surveys', surveys());
  router.use('/users', users());

  return router;
};
