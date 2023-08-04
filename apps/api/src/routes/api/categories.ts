import { Router } from 'express';

import { authenticate } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/categories';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { categoriesController } = ioc.cradle;

  const router = Router();

  authenticate(router, 'survey');

  // Root category contents
  router.get('/:localeId', wrapAsync(categoriesController.rootContents));

  // Category contents
  router.get('/:localeId/:code', validation.browse, wrapAsync(categoriesController.browse));
  router.get('/:localeId/:code/contents', wrapAsync(categoriesController.contents));

  return router;
};
