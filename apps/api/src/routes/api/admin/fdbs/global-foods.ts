import { Router } from 'express';

import validation from '@intake24/api/http/requests/admin/fdbs/foods';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { adminGlobalFoodsController } = ioc.cradle;
  const router = Router({ mergeParams: true });

  router.route('').post(wrapAsync(adminGlobalFoodsController.store));

  return router;
};
