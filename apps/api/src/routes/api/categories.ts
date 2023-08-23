import { Router } from 'express';

import { authenticate } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/categories';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { categoriesController } = ioc.cradle;

  const router = Router();

  authenticate(router, 'survey');

  router.get('/:localeId', wrapAsync(categoriesController.rootContents));
  router.get('/:localeId/:code', wrapAsync(categoriesController.contents));
  router.get('/:localeId/:code/search', validation.browse, wrapAsync(categoriesController.browse));

  return router;
};
