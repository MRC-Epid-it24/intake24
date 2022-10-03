import { Router } from 'express';

import validation from '@intake24/api/http/requests/admin/locales';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { localeSplitListController } = ioc.cradle;
  const router = Router({ mergeParams: true });

  router
    .route('')
    .post(validation.splitLists, wrapAsync(localeSplitListController.set))
    .get(wrapAsync(localeSplitListController.get));

  return router;
};
