import { Router } from 'express';

import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/locales';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { localeSplitWordController } = ioc.cradle;
  const router = Router({ mergeParams: true });

  router.use(permission('locales|split-words'));

  router
    .route('')
    .post(validation.splitWords, wrapAsync(localeSplitWordController.set))
    .get(wrapAsync(localeSplitWordController.get));

  return router;
};
