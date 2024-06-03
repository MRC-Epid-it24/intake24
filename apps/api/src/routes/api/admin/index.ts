import { Router } from 'express';

import { authenticate, isAccountVerified } from '@intake24/api/http/middleware';

import categories from './categories';
import fdbs from './fdbs';
import foods from './foods';
import images from './images';
import locales from './locales';
import surveys from './surveys';

export default () => {
  const router = Router();

  // Authenticated & verified
  authenticate(router, 'admin');
  router.use(isAccountVerified);

  router.use('/categories', categories());
  router.use('/fdbs', fdbs());
  router.use('/foods', foods());
  router.use('/images', images());
  router.use('/locales', locales());
  router.use('/surveys', surveys());

  return router;
};
