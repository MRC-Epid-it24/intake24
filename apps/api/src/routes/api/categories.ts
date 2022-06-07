import { Router } from 'express';
import { authenticate } from '@intake24/api/http/middleware';
import { wrapAsync } from '@intake24/api/util';
import ioc from '@intake24/api/ioc';

export default () => {
  const { categoriesController } = ioc.cradle;

  const router = Router();

  authenticate(router, 'survey');

  // Root category contents
  router.get('/:localeId', wrapAsync(categoriesController.browseRoot));

  // Category contents
  router.get('/:localeId/:code', wrapAsync(categoriesController.browse));

  return router;
};
