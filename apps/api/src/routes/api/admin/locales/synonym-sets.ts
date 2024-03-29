import { Router } from 'express';

import validation from '@intake24/api/http/requests/admin/locales';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { localeSynonymSetController } = ioc.cradle;
  const router = Router({ mergeParams: true });

  router
    .route('')
    .post(validation.synonymLists, wrapAsync(localeSynonymSetController.set))
    .get(wrapAsync(localeSynonymSetController.get));

  return router;
};
